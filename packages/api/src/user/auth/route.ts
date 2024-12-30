import { COOKIE_OPTIONS } from "@project/api/cookie/constants"
import { handleError } from "@project/api/error/utils"
import { createRouter, zValidator } from "@project/api/utils"
import { eq } from "@project/db"
import {
   oauthProviders,
   user as userSchema,
   verifyLoginOTPInput,
} from "@project/db/schema/user"
import { env } from "@project/env"
import { logger } from "@project/shared/logger"
import { generateCodeVerifier, generateState } from "arctic"
import { getCookie, setCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { createSession, generateEmailOTP, verifyEmailOTP } from "."
import { createGoogleSession, googleClient } from "./google"

export const authRoute = createRouter()
   .post(
      "/send-login-otp",
      zValidator(
         "json",
         z.object({
            email: z.string().email(),
         }),
      ),
      async (c) => {
         await c.get("db").transaction(async (tx) => {
            const { email } = c.req.valid("json")
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
                  .select()
                  .from(userSchema)
                  .where(eq(userSchema.email, email))

               if (!existingUser)
                  throw new HTTPException(500, {
                     message: "Couldn't create account",
                  })

               user = existingUser
            }

            const verificationCode = await generateEmailOTP({
               tx: tx as never,
               userId: user.id,
               email,
            })

            if (env.server.NODE_ENV === "development") {
               logger.info(`OTP CODE: ${verificationCode}`)
            } else {
               throw new HTTPException(400, {
                  message: "Not implemented",
               })
               // const res = await c.get("emails").send({
               //    from: EMAIL_FROM,
               //    to: email,
               //    subject: `Project one-time password`,
               //    html: loginOtpEmail(verificationCode),
               // })
               // if (res.error)
               //    throw new HTTPException(500, {
               //       message: "Couldn't send email",
               //    })
            }

            return { userId: user.id }
         })
      },
   )
   .post(
      "/verify-login-otp",
      zValidator("json", verifyLoginOTPInput),
      async (c) => {
         const { code, userId } = c.req.valid("json")
         const validCode = await verifyEmailOTP(c.get("db"), userId, code)
         if (!validCode)
            throw new HTTPException(400, {
               message: "Code is invalid or expired",
            })

         await c
            .get("db")
            .update(userSchema)
            .set({ emailVerified: true })
            .where(eq(userSchema.id, userId))

         await createSession(c, userId)
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
         const redirect = c.req.valid("query").redirect ?? env.client.WEB_DOMAIN

         setCookie(c, "redirect", redirect, COOKIE_OPTIONS)

         const state = generateState()

         if (provider === "github")
            throw new HTTPException(400, {
               message: "Not implemented",
            })

         if (provider === "google") {
            const codeVerifier = generateCodeVerifier()

            const url = googleClient().createAuthorizationURL(
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
   .all(
      "/:provider/callback",
      zValidator("param", z.object({ provider: z.enum(oauthProviders) })),
      zValidator("query", z.object({ code: z.string(), state: z.string() })),
      async (c) => {
         const redirect = getCookie(c, "redirect") ?? env.client.WEB_DOMAIN
         const redirectUrl = new URL(redirect)

         const provider = c.req.valid("param").provider
         const { code, state } = c.req.valid("query")

         const stateCookie = getCookie(c, `${provider}_oauth_state`)

         if (
            !state ||
            !stateCookie ||
            !code ||
            stateCookie !== state ||
            !redirect
         )
            throw new HTTPException(401, {
               message: "Invalid cookie",
            })

         if (provider === "github")
            throw new HTTPException(400, {
               message: "Not implemented",
            })

         if (provider === "google") {
            await createGoogleSession({
               c,
            })

            return c.redirect(redirectUrl.toString())
         }
      },
   )
   .onError((error, c) => {
      const redirect = getCookie(c, "redirect")
      if (!redirect) return handleError(error, c)

      // c.get("sentry").captureException(error)
      logger.error(error)

      const session = c.get("session")

      // redirect back to login page if not logged in
      const newRedirectUrl = new URL(
         !session?.userId ? `${redirect}/login` : redirect,
      )

      newRedirectUrl.searchParams.append("error", "true")

      return c.redirect(newRedirectUrl.toString())
   })
