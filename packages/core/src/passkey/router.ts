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
import { passkeyCredential } from "@project/core/passkey/schema"
import type { PasskeyCredential } from "@project/core/passkey/types"
import {
   createPasskeyChallenge,
   passkeyChallengeRateLimitBucket,
} from "@project/core/passkey/utils"
import { verifyPasskeyChallenge } from "@project/core/passkey/utils"
import { procedure, router } from "@project/core/trpc/context"
import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

export const passkeyRouter = router({
   list: procedure.query(async ({ ctx }) => {
      return await ctx.db.query.passkeyCredential.findMany({
         where: eq(passkeyCredential.userID, ctx.user.id),
         columns: {
            id: true,
            name: true,
         },
         orderBy: (data) => desc(data.createdAt),
      })
   }),
   create: procedure
      .input(
         z.object({
            name: z.string(),
            attestation: z.string(),
            clientData: z.string(),
         }),
      )
      .mutation(async ({ ctx, input }) => {
         const { name, attestation, clientData } = input
         const decodedAttestation = decodeBase64(attestation)
         const decodedClientData = decodeBase64(clientData)

         const attestationObject = parseAttestationObject(decodedAttestation)
         const attestationStatement = attestationObject.attestationStatement
         const authenticatorData = attestationObject.authenticatorData

         const host = ctx.host?.split(":")[0] ?? ""

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
            parsedClientData.origin !== ctx.vars.WEB_URL ||
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
               userID: ctx.user.id,
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
               userID: ctx.user.id,
               algorithm: coseAlgorithmRS256,
               name,
               publicKey: encodedPublicKey,
            }
         } else {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Unsupported algorithm",
            })
         }

         await ctx.db.insert(passkeyCredential).values(credential)
      }),
   createChallenge: procedure.mutation(async ({ ctx }) => {
      if (!passkeyChallengeRateLimitBucket.consume(ctx.user.id, 1))
         throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const credentials = await ctx.db.query.passkeyCredential.findMany({
         where: eq(passkeyCredential.userID, ctx.user.id),
         columns: {
            id: true,
         },
      })

      const credentialUserID = new TextEncoder().encode(ctx.user.id).slice(0, 8)
      const encodedCredentialUserID = encodeBase64(credentialUserID)

      return {
         challenge: encodeBase64(createPasskeyChallenge()),
         credentialIds: credentials.map((c) => encodeBase64(c.id)).join(","),
         credentialUserID: encodedCredentialUserID,
      }
   }),
   delete: procedure
      .input(z.object({ id: z.any() }))
      .mutation(async ({ ctx, input }) => {
         const decodedId = decodeBase64urlIgnorePadding(input.id)

         await ctx.db
            .delete(passkeyCredential)
            .where(
               and(
                  eq(passkeyCredential.userID, ctx.user.id),
                  eq(passkeyCredential.id, decodedId),
               ),
            )
      }),
})
