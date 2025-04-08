import type { HonoEnv } from "@project/core/api/types"
import { createAuthSession } from "@project/core/auth"
import { oauthAccount } from "@project/core/database/schema"
import invariant from "@project/core/invariant"
import { user } from "@project/core/user/schema"
import { Google } from "arctic"
import { eq } from "drizzle-orm"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import ky from "ky"

export const googleClient = (c: Context<HonoEnv>) =>
   new Google(
      c.var.env.GOOGLE_CLIENT_ID,
      c.var.env.GOOGLE_CLIENT_SECRET,
      `${c.var.env.API_URL}/auth/google/callback`,
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

   const googleUserProfile = await ky(
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

   const googleUserId = googleUserProfile.id.toString()

   const existingOauthAccount = await c.var.db.query.oauthAccount.findFirst({
      where: (account) => eq(account.providerUserId, googleUserId),
   })

   const existingUser = await c.var.db.query.user.findFirst({
      where: (u) => eq(u.email, googleUserProfile.email),
   })

   if (existingUser?.id && !existingOauthAccount) {
      await c.var.db.insert(oauthAccount).values({
         providerUserId: googleUserId,
         providerId: "google",
         userId: existingUser.id,
      })

      return await createAuthSession(c, existingUser.id)
   }

   if (existingOauthAccount)
      return await createAuthSession(c, existingOauthAccount.userId)

   const createdUser = await c.var.db.transaction(async (tx) => {
      const [existingUser] = await tx
         .select()
         .from(user)
         .where(eq(user.email, googleUserProfile.email))

      let userId: string | undefined

      if (existingUser) {
         userId = existingUser.id
      } else {
         const [createdUser] = await tx
            .insert(user)
            .values({
               email: googleUserProfile.email,
               name: googleUserProfile.name,
               avatarUrl: googleUserProfile.picture,
            })
            .returning({ id: user.id })

         invariant(createdUser, "Failed to create user")
         userId = createdUser.id
      }

      await tx
         .insert(oauthAccount)
         .values({
            providerUserId: googleUserId,
            providerId: "google",
            userId: createdUser.id,
         })
         .onConflictDoNothing()

      return { id: userId }
   })

   return await createAuthSession(c, createdUser.id)
}
