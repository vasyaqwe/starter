import { ECDSAPublicKey, p256 } from "@oslojs/crypto/ecdsa"
import { RSAPublicKey } from "@oslojs/crypto/rsa"
import {
   decodeBase64,
   decodeBase64urlIgnorePadding,
   encodeBase64,
} from "@oslojs/encoding"
import {
   AttestationStatementFormat,
   ClientDataType,
   coseAlgorithmES256,
   coseAlgorithmRS256,
   coseEllipticCurveP256,
   parseAttestationObject,
   parseClientDataJSON,
} from "@oslojs/webauthn"
import { createRouter, zValidator } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import {
   createPasskeyChallenge,
   passkeyChallengeRateLimitBucket,
   verifyPasskeyChallenge,
} from "@project/api/user/auth/passkey/utils"
import { and, desc, eq } from "@project/db"
import {
   type PasskeyCredential,
   passkeyCredential,
} from "@project/db/schema/user"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

export const passkeyRoute = createRouter()
   .use(authMiddleware)
   .get("/", async (c) => {
      const credentials = await c.var.db.query.passkeyCredential.findMany({
         where: eq(passkeyCredential.userId, c.var.user.id),
         columns: {
            id: true,
            name: true,
         },
         orderBy: (data) => desc(data.createdAt),
      })
      return c.json(credentials)
   })
   .post("/challenge", async (c) => {
      if (!passkeyChallengeRateLimitBucket.consume(c.var.user.id, 1))
         throw new HTTPException(429, { message: "Too many requests" })

      const credentials = await c.var.db.query.passkeyCredential.findMany({
         where: eq(passkeyCredential.userId, c.var.user.id),
         columns: {
            id: true,
         },
      })

      const credentialUserId = new TextEncoder()
         .encode(c.var.user.id)
         .slice(0, 8)
      const encodedCredentialUserId = encodeBase64(credentialUserId)

      return c.json({
         challenge: encodeBase64(createPasskeyChallenge()),
         credentialIds: credentials.map((c) => encodeBase64(c.id)).join(","),
         credentialUserId: encodedCredentialUserId,
      })
   })
   .post(
      "/",
      zValidator(
         "json",
         z.object({
            name: z.string(),
            attestation: z.string(),
            clientData: z.string(),
         }),
      ),
      async (c) => {
         const { name, attestation, clientData } = c.req.valid("json")
         const decodedAttestation = decodeBase64(attestation)
         const decodedClientData = decodeBase64(clientData)

         const attestationObject = parseAttestationObject(decodedAttestation)
         const attestationStatement = attestationObject.attestationStatement
         const authenticatorData = attestationObject.authenticatorData

         const host = c.req.header("host")?.split(":")[0] ?? ""

         if (
            attestationStatement.format !== AttestationStatementFormat.None ||
            !authenticatorData.verifyRelyingPartyIdHash(host) ||
            !authenticatorData.userPresent ||
            !authenticatorData.userVerified ||
            authenticatorData.credential === null
         )
            throw new HTTPException(400, { message: "Invalid data" })

         const parsedClientData = parseClientDataJSON(decodedClientData)

         if (
            parsedClientData.type !== ClientDataType.Create ||
            !verifyPasskeyChallenge(parsedClientData.challenge) ||
            parsedClientData.origin !== c.var.env.WEB_DOMAIN ||
            (parsedClientData.crossOrigin !== null &&
               parsedClientData.crossOrigin)
         )
            throw new HTTPException(400, { message: "Invalid data" })

         let credential: Omit<PasskeyCredential, "createdAt" | "updatedAt">
         if (
            authenticatorData.credential.publicKey.algorithm() ===
            coseAlgorithmES256
         ) {
            const cosePublicKey = authenticatorData.credential.publicKey.ec2()

            if (cosePublicKey.curve !== coseEllipticCurveP256)
               throw new HTTPException(400, {
                  message: "Unsupported algorithm",
               })

            const encodedPublicKey = new ECDSAPublicKey(
               p256,
               cosePublicKey.x,
               cosePublicKey.y,
            ).encodeSEC1Uncompressed()

            credential = {
               id: authenticatorData.credential.id,
               userId: c.var.user.id,
               algorithm: coseAlgorithmES256,
               name,
               publicKey: encodedPublicKey,
            }
         } else if (
            authenticatorData.credential.publicKey.algorithm() ===
            coseAlgorithmRS256
         ) {
            const cosePublicKey = authenticatorData.credential.publicKey.rsa()

            const encodedPublicKey = new RSAPublicKey(
               cosePublicKey.n,
               cosePublicKey.e,
            ).encodePKCS1()

            credential = {
               id: authenticatorData.credential.id,
               userId: c.var.user.id,
               algorithm: coseAlgorithmRS256,
               name,
               publicKey: encodedPublicKey,
            }
         } else {
            throw new HTTPException(400, { message: "Unsupported algorithm" })
         }

         await c.var.db.transaction(async (tx) => {
            const credentials = await tx.query.passkeyCredential.findMany({
               where: eq(passkeyCredential.userId, c.var.user.id),
            })

            if (credentials.length >= 5)
               throw new HTTPException(400, { message: "Too many credentials" })

            await tx.insert(passkeyCredential).values(credential)
         })

         return c.json({
            status: "ok",
         })
      },
   )
   .delete(
      "/:id",
      zValidator(
         "param",
         z.object({
            id: z.any(),
         }),
      ),
      async (c) => {
         const { id } = c.req.valid("param")
         const decodedId = decodeBase64urlIgnorePadding(id)

         await c.var.db
            .delete(passkeyCredential)
            .where(
               and(
                  eq(passkeyCredential.userId, c.var.user.id),
                  eq(passkeyCredential.id, decodedId),
               ),
            )

         return c.json({
            status: "ok",
         })
      },
   )
