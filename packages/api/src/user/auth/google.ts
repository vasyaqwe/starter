import type { HonoContext } from "@project/api/context"
import { eq } from "@project/db"
import { oauthAccount, user } from "@project/db/schema/user"
import { env } from "@project/env"
import { Google } from "arctic"
import { getCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import ky from "ky"
import { createSession } from "."

export const googleClient = () =>
   new Google(
      env.server.GOOGLE_CLIENT_ID,
      env.server.GOOGLE_CLIENT_SECRET,
      `${env.client.SERVER_DOMAIN}/auth/google/callback`,
   )

export const createGoogleSession = async ({
   c,
}: {
   c: HonoContext
}) => {
   const code = c.req.query("code")
   const state = c.req.query("state")
   const storedState = getCookie(c, "google_oauth_state")
   const codeVerifier = getCookie(c, "google_oauth_code_verifier")

   if (
      !code ||
      !state ||
      !storedState ||
      state !== storedState ||
      !codeVerifier
   ) {
      throw new HTTPException(400, {
         message: "Invalid state or code in Google OAuth callback",
      })
   }

   const tokens = await googleClient().validateAuthorizationCode(
      code,
      codeVerifier,
   )

   const googleUserResponse = await ky(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
         headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
         },
         hooks: {
            afterResponse: [
               async (_req, _opts, res) => {
                  if (!res.ok)
                     throw new HTTPException(res.status as never, {
                        message: await res.text(),
                     })
               },
            ],
         },
      },
   ).json<{
      id: string
      email: string
      name: string
      picture?: string
      verified_email: boolean
   }>()

   const googleUserId = googleUserResponse.id.toString()

   const existingOauthAccount = await c.get("db").query.oauthAccount.findFirst({
      where: (account) => eq(account.providerUserId, googleUserId),
   })

   const existingUser = await c.get("db").query.user.findFirst({
      where: (u) => eq(u.email, googleUserResponse.email),
   })

   if (existingUser?.id && !existingOauthAccount) {
      await c.get("db").insert(oauthAccount).values({
         providerUserId: googleUserId,
         providerId: "google",
         userId: existingUser.id,
      })

      return await createSession(c, existingUser.id)
   }

   if (existingOauthAccount) {
      return await createSession(c, existingOauthAccount.userId)
   }

   const created = await c.get("db").transaction(async (tx) => {
      const [created] = await tx
         .insert(user)
         .values({
            name: googleUserResponse.name,
            avatarUrl: googleUserResponse.picture,
            email: googleUserResponse.email,
            emailVerified: true,
         })
         .returning({ userId: user.id })

      if (!created) throw new Error("Error creating user")

      await tx.insert(oauthAccount).values({
         providerUserId: googleUserId,
         providerId: "google",
         userId: created.userId,
      })

      return created
   })

   return await createSession(c, created.userId)
}
