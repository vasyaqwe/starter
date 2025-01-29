import {
   decodePKIXECDSASignature,
   decodeSEC1PublicKey,
   p256,
   verifyECDSASignature,
} from "@oslojs/crypto/ecdsa"
import {
   decodePKCS1RSAPublicKey,
   sha256ObjectIdentifier,
   verifyRSASSAPKCS1v15Signature,
} from "@oslojs/crypto/rsa"
import { sha256 } from "@oslojs/crypto/sha2"
import { decodeBase64, encodeBase64 } from "@oslojs/encoding"
import {
   ClientDataType,
   coseAlgorithmES256,
   coseAlgorithmRS256,
   createAssertionSignatureMessage,
   parseAuthenticatorData,
   parseClientDataJSON,
} from "@oslojs/webauthn"
import { COOKIE_OPTIONS } from "@project/api/cookie/constants"
import { handleError } from "@project/api/error/utils"
import { createRouter, zValidator } from "@project/api/misc/utils"
import {
   ExpiringTokenBucket,
   RefillingTokenBucket,
} from "@project/api/rate-limit"
import {
   createPasskeyChallenge,
   passkeyChallengeRateLimitBucket,
   verifyPasskeyChallenge,
} from "@project/api/user/auth/passkey/utils"
import { eq } from "@project/db"
import {
   oauthProviders,
   passkeyCredential,
   user as userSchema,
   verifyLoginOTPInput,
} from "@project/db/schema/user"
import { EMAIL_FROM } from "@project/email"
import { loginOtpEmail } from "@project/email/templates/login-otp"
import { logger } from "@project/misc/logger"
import { generateCodeVerifier, generateState } from "arctic"
import { getCookie, setCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { createSession, generateEmailOTP, verifyEmailOTP } from "."
import { createGoogleSession, googleClient } from "./google"

const sendOtpBucket = new ExpiringTokenBucket<string>(3, 60)
const verifyOtpBucket = new RefillingTokenBucket<string>(5, 60)

export const authRoute = createRouter()
   .post("/passkey/challenge", async (c) => {
      const ip = c.req.header("x-forwarded-for")
      if (ip && !passkeyChallengeRateLimitBucket.consume(ip, 1))
         throw new HTTPException(429, { message: "Too many requests" })

      return c.json(encodeBase64(createPasskeyChallenge()))
   })
   .post(
      "/passkey/login",
      zValidator(
         "json",
         z.object({
            authenticatorData: z.string(),
            clientData: z.string(),
            credentialId: z.string(),
            signature: z.string(),
         }),
      ),
      async (c) => {
         const { authenticatorData, clientData, credentialId, signature } =
            c.req.valid("json")
         const decodedAuthenticatorData = decodeBase64(authenticatorData)
         const decodedClientData = decodeBase64(clientData)
         const decodedCredentialId = decodeBase64(credentialId)
         const decodedSignature = decodeBase64(signature)

         const parsedAuthenticatorData = parseAuthenticatorData(
            decodedAuthenticatorData,
         )

         const host = c.req.header("host")?.split(":")[0] ?? ""

         if (
            !parsedAuthenticatorData.verifyRelyingPartyIdHash(host) ||
            !parsedAuthenticatorData.userPresent ||
            !parsedAuthenticatorData.userVerified
         )
            throw new HTTPException(400, { message: "Invalid data" })

         const parsedClientData = parseClientDataJSON(decodedClientData)

         if (
            parsedClientData.type !== ClientDataType.Get ||
            !verifyPasskeyChallenge(parsedClientData.challenge) ||
            parsedClientData.origin !== c.var.env.WEB_DOMAIN ||
            (parsedClientData.crossOrigin !== null &&
               parsedClientData.crossOrigin)
         )
            throw new HTTPException(400, { message: "Invalid data" })

         const credential = await c.var.db.query.passkeyCredential.findFirst({
            where: eq(passkeyCredential.id, decodedCredentialId),
            columns: {
               id: true,
               userId: true,
               name: true,
               algorithm: true,
               publicKey: true,
            },
         })

         if (!credential)
            throw new HTTPException(400, { message: "Invalid credentials" })

         let validSignature: boolean
         if (credential.algorithm === coseAlgorithmES256) {
            const ecdsaSignature = decodePKIXECDSASignature(decodedSignature)
            const ecdsaPublicKey = decodeSEC1PublicKey(
               p256,
               credential.publicKey,
            )
            const hash = sha256(
               createAssertionSignatureMessage(
                  decodedAuthenticatorData,
                  decodedClientData,
               ),
            )
            validSignature = verifyECDSASignature(
               ecdsaPublicKey,
               hash,
               ecdsaSignature,
            )
         } else if (credential.algorithm === coseAlgorithmRS256) {
            const rsaPublicKey = decodePKCS1RSAPublicKey(credential.publicKey)
            const hash = sha256(
               createAssertionSignatureMessage(
                  decodedAuthenticatorData,
                  decodedClientData,
               ),
            )
            validSignature = verifyRSASSAPKCS1v15Signature(
               rsaPublicKey,
               sha256ObjectIdentifier,
               hash,
               decodedSignature,
            )
         } else {
            throw new HTTPException(400, { message: "Unsupported algorithm" })
         }

         if (!validSignature)
            throw new HTTPException(400, { message: "Invalid signature" })

         await createSession(c, credential.userId)
         return c.json({ status: "ok" })
      },
   )
   .post(
      "/send-login-otp",
      zValidator(
         "json",
         z.object({
            email: z.string(),
         }),
      ),
      async (c) => {
         const { email } = c.req.valid("json")

         if (!sendOtpBucket.consume(email, 1))
            throw new HTTPException(429, {
               message: "Too many requests. Please try again later.",
            })

         await c.var.db.transaction(async (tx) => {
            let user: { id: string } | null = null

            const [createdUser] = await tx
               .insert(userSchema)
               .values({
                  email,
               })
               .returning({ id: userSchema.id })
               .onConflictDoNothing({ target: userSchema.email })

            if (createdUser) {
               user = createdUser
            } else {
               const [existingUser] = await tx
                  .select({ id: userSchema.id })
                  .from(userSchema)
                  .where(eq(userSchema.email, email))

               if (!existingUser)
                  throw new HTTPException(500, {
                     message: "Couldn't create account",
                  })

               user = existingUser
            }

            const otp = await generateEmailOTP({
               tx: tx as never,
               userId: user.id,
               email,
            })

            if (c.var.env.NODE_ENV === "development") {
               logger.info(`OTP: ${otp}`)
            } else {
               const res = await c.var.email.emails.send({
                  from: EMAIL_FROM,
                  to: email,
                  subject: `Project one-time password`,
                  html: loginOtpEmail(otp),
               })
               if (res.error)
                  throw new HTTPException(500, {
                     message: `Couldn't send email: ${res.error.message}`,
                  })
            }
         })

         return c.json({ email })
      },
   )
   .post(
      "/verify-login-otp",
      zValidator("json", verifyLoginOTPInput),
      async (c) => {
         const { code, email } = c.req.valid("json")

         if (!verifyOtpBucket.consume(email, 1))
            throw new HTTPException(429, {
               message: "Too many requests. Please try again later.",
            })

         const { userId } = await verifyEmailOTP(c.var.db, email, code)

         if (!userId)
            throw new HTTPException(400, {
               message: "Code is invalid or expired",
            })

         await c
            .get("db")
            .update(userSchema)
            .set({ emailVerified: true })
            .where(eq(userSchema.email, email))

         await createSession(c, userId)

         return c.json({ status: "ok" })
      },
   )
   .get(
      "/:provider",
      zValidator("param", z.object({ provider: z.enum(oauthProviders) })),
      zValidator(
         "query",
         z.object({
            redirect: z.string().optional(),
         }),
      ),
      async (c) => {
         const provider = c.req.valid("param").provider
         const redirect = c.req.valid("query").redirect ?? c.var.env.WEB_DOMAIN

         setCookie(c, "redirect", redirect, COOKIE_OPTIONS)

         const state = generateState()

         if (provider === "github")
            throw new HTTPException(400, {
               message: "Not implemented",
            })

         if (provider === "google") {
            const codeVerifier = generateCodeVerifier()

            const url = googleClient(c).createAuthorizationURL(
               state,
               codeVerifier,
               ["profile", "email"],
            )

            setCookie(c, "google_oauth_state", state, COOKIE_OPTIONS)
            setCookie(
               c,
               "google_oauth_code_verifier",
               codeVerifier,
               COOKIE_OPTIONS,
            )

            return c.redirect(url.toString())
         }
      },
   )
   .get(
      "/:provider/callback",
      zValidator("param", z.object({ provider: z.enum(oauthProviders) })),
      zValidator(
         "query",
         z.object({
            code: z.string(),
            state: z.string(),
            client: z.enum(["native", "web"]).default("web"),
            code_verifier: z.string().optional(),
         }),
      ),
      async (c) => {
         const redirect = getCookie(c, "redirect") ?? c.var.env.WEB_DOMAIN
         const redirectUrl = new URL(redirect).toString()

         const provider = c.req.valid("param").provider
         const {
            code,
            state,
            client,
            code_verifier: queryCodeVerifier,
         } = c.req.valid("query")

         let codeVerifier: string
         if (client === "native") {
            // For native, use query
            codeVerifier = queryCodeVerifier ?? ""
         } else {
            // For web, use cookies
            codeVerifier = getCookie(c, `${provider}_oauth_code_verifier`) ?? ""
         }

         const storedState = getCookie(c, `${provider}_oauth_state`)

         if (
            !code ||
            !state ||
            !codeVerifier ||
            // on web, compare state from query with state from cookies
            (client === "web" && (!storedState || storedState !== state))
         ) {
            throw new HTTPException(401, {
               message: "Invalid state",
            })
         }

         if (provider === "github")
            throw new HTTPException(400, {
               message: "Not implemented",
            })

         if (provider === "google") {
            if (client === "native") {
               await createGoogleSession({
                  c,
                  code,
                  codeVerifier,
               })
               return c.json({ status: "ok" })
            }

            if (redirectUrl.startsWith("project")) {
               const url = `project://finish-auth?code=${code}&state=${state}&code_verifier=${codeVerifier}`

               return c.html(`
                   <html>
                     <head>
                     <title>Opening app...</title>
                     </head>
                     <body>
                     <p>Opening app... <br /> If app isn't opening, <a href="${url}">click here</a>.</p>
                     <script>
                        setTimeout(() => {
                           window.location.href = "${url}";
                        }, 100);
                     </script>
                     </body>
                  </html>
                `)
            }

            await createGoogleSession({
               c,
               code,
               codeVerifier,
            })

            return c.redirect(redirectUrl)
         }
      },
   )
   .onError((error, c) => {
      const redirect = getCookie(c, "redirect")
      if (!redirect) return handleError(error, c)

      // c.var.sentry.captureException(error)
      logger.error("auth error:", error)

      // redirect back to login page if not logged in
      const newRedirectUrl = new URL(`${redirect}/login`)

      newRedirectUrl.searchParams.append("error", "true")

      return c.redirect(newRedirectUrl.toString())
   })
