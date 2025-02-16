import type { HonoEnv } from "@project/api/context"
import { eq } from "@project/db"
import { oauthAccount, user } from "@project/db/schema/user"
import { Google } from "arctic"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import ky from "ky"
import { createSession } from "."

export const googleClient = (c: Context<HonoEnv>) =>
   new Google(
      c.var.env.GOOGLE_CLIENT_ID,
      c.var.env.GOOGLE_CLIENT_SECRET,
      `${c.var.env.SERVER_DOMAIN}/auth/google/callback`,
   )

export const createGoogleSession = async ({
   c,
   code,
   codeVerifier,
}: {
   c: Context<HonoEnv>
   code: string
   codeVerifier: string
}) => {
   const tokens = await googleClient(c).validateAuthorizationCode(
      code,
      codeVerifier,
   )

   const googleUserResponse = await ky(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
         headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
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

   const existingOauthAccount = await c.var.db.query.oauthAccount.findFirst({
      where: (account) => eq(account.providerUserId, googleUserId),
   })

   const existingUser = await c.var.db.query.user.findFirst({
      where: (u) => eq(u.email, googleUserResponse.email),
   })

   if (existingUser?.id && !existingOauthAccount) {
      await c.var.db.insert(oauthAccount).values({
         providerUserId: googleUserId,
         providerId: "google",
         userId: existingUser.id,
      })

      return await createSession(c, existingUser.id)
   }

   if (existingOauthAccount) {
      return await createSession(c, existingOauthAccount.userId)
   }

   const created = await c.var.db.transaction(async (tx) => {
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
