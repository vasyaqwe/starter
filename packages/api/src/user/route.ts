import { ECDSAPublicKey, p256 } from "@oslojs/crypto/ecdsa"
import { RSAPublicKey } from "@oslojs/crypto/rsa"
import {
   decodeBase64,
   decodeBase64urlIgnorePadding,
   encodeBase64,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import {
   type AttestationStatement,
   AttestationStatementFormat,
   type AuthenticatorData,
   type COSEEC2PublicKey,
   type COSERSAPublicKey,
   type ClientData,
   ClientDataType,
   coseAlgorithmES256,
   coseAlgorithmRS256,
   coseEllipticCurveP256,
   parseAttestationObject,
   parseClientDataJSON,
} from "@oslojs/webauthn"
import { createRouter, zValidator } from "@project/api/misc/utils"
import { RefillingTokenBucket } from "@project/api/rate-limit"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { and, desc, eq } from "@project/db"
import {
   type PasskeyCredential,
   passkeyCredential,
} from "@project/db/schema/user"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { deleteSessionTokenCookie, invalidateSession } from "./auth"

const passkeyChallengeRateLimitBucket = new RefillingTokenBucket<string>(10, 10)
const challengeBucket = new Set<string>()

const createChallenge = () => {
   const challenge = new Uint8Array(20)
   crypto.getRandomValues(challenge)
   const encoded = encodeHexLowerCase(challenge)
   challengeBucket.add(encoded)
   return challenge
}
const verifyChallenge = (challenge: Uint8Array) => {
   const encoded = encodeHexLowerCase(challenge)
   return challengeBucket.delete(encoded)
}

export const userRoute = createRouter()
   .use(authMiddleware)
   .get("/me", async (c) => {
      return c.json(c.var.user)
   })
   .get("/passkey", async (c) => {
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
   .post("/passkey/challenge", async (c) => {
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
         challenge: encodeBase64(createChallenge()),
         credentialIds: credentials.map((c) => encodeBase64(c.id)).join(","),
         credentialUserId: encodedCredentialUserId,
      })
   })
   .post(
      "/passkey",
      zValidator(
         "json",
         z.object({
            name: z.string(),
            attestation: z.string(),
            clientDataJSON: z.string(),
         }),
      ),
      async (c) => {
         const { name, attestation, clientDataJSON } = c.req.valid("json")
         const decodedAttestation = decodeBase64(attestation)
         const decodedClientData = decodeBase64(clientDataJSON)

         let attestationStatement: AttestationStatement
         let authenticatorData: AuthenticatorData
         try {
            const attestationObject = parseAttestationObject(decodedAttestation)
            attestationStatement = attestationObject.attestationStatement
            authenticatorData = attestationObject.authenticatorData
         } catch {
            throw new HTTPException(400, { message: "Invalid data" })
         }
         if (
            attestationStatement.format !== AttestationStatementFormat.None ||
            !authenticatorData.verifyRelyingPartyIdHash("localhost") ||
            !authenticatorData.userPresent ||
            !authenticatorData.userVerified ||
            authenticatorData.credential === null
         )
            throw new HTTPException(400, { message: "Invalid data" })

         let clientData: ClientData
         try {
            clientData = parseClientDataJSON(decodedClientData)
         } catch {
            throw new HTTPException(400, { message: "Invalid data" })
         }

         if (
            clientData.type !== ClientDataType.Create ||
            !verifyChallenge(clientData.challenge) ||
            clientData.origin !== "http://localhost:3000" ||
            (clientData.crossOrigin !== null && clientData.crossOrigin)
         )
            throw new HTTPException(400, { message: "Invalid data" })

         let credential: Omit<PasskeyCredential, "createdAt" | "updatedAt">
         if (
            authenticatorData.credential.publicKey.algorithm() ===
            coseAlgorithmES256
         ) {
            let cosePublicKey: COSEEC2PublicKey
            try {
               cosePublicKey = authenticatorData.credential.publicKey.ec2()
            } catch {
               throw new HTTPException(400, { message: "Invalid data" })
            }
            if (cosePublicKey.curve !== coseEllipticCurveP256) {
               throw new HTTPException(400, {
                  message: "Unsupported algorithm",
               })
            }
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
            let cosePublicKey: COSERSAPublicKey
            try {
               cosePublicKey = authenticatorData.credential.publicKey.rsa()
            } catch {
               throw new HTTPException(400, { message: "Invalid data" })
            }

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
            if (credentials.length >= 5) {
               throw new HTTPException(400, { message: "Too many credentials" })
            }
            await tx.insert(passkeyCredential).values(credential)
         })

         return c.json({
            status: "ok",
         })
      },
   )
   .delete(
      "/passkey/:id",
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
   .post("/logout", async (c) => {
      deleteSessionTokenCookie(c)
      await invalidateSession(c, c.var.session.id)
      return c.json({ message: "OK" })
   })
