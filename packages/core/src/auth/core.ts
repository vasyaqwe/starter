export * from "./middleware"
export * from "./route"
export * from "./email"
import { type RandomReader, generateRandomString } from "@oslojs/crypto/random"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import type { Api } from "@project/core/api"
import { COOKIE_OPTIONS } from "@project/core/cookie/constants"
import type { Database } from "@project/core/database"
import { DateTime } from "@project/core/date"
import { emailVerificationRequest, session } from "@project/core/user/schema"
import { eq } from "drizzle-orm"
import type { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from "./constants"

export const createSession = async (
   c: Context<Api.HonoEnv>,
   userId: string,
) => {
   const token = generateSessionToken()
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

   await c
      .get("db")
      .insert(session)
      .values({
         id: sessionId,
         userId: userId,
         expiresAt: new Date(Date.now() + 1000 * SESSION_EXPIRATION_SECONDS),
      })

   setSessionTokenCookie(c, token)
}

export const getSessionTokenCookie = (c: Context) =>
   getCookie(c, SESSION_COOKIE_NAME)

export const setSessionTokenCookie = (c: Context, token: string) => {
   setCookie(c, SESSION_COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRATION_SECONDS,
   })
}

export const deleteSessionTokenCookie = (c: Context) => {
   setCookie(c, SESSION_COOKIE_NAME, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
   })
}

export const generateSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

export const invalidateSession = async (
   c: Context<Api.AuthedHonoEnv>,
   sessionId: string,
) => await c.var.db.delete(session).where(eq(session.id, sessionId))

export const generateEmailOTP = async ({
   tx,
   userId,
   email,
}: {
   tx: Database.Client
   userId: string
   email: string
}) => {
   await tx
      .delete(emailVerificationRequest)
      .where(eq(emailVerificationRequest.email, email))

   const random: RandomReader = {
      read(bytes) {
         crypto.getRandomValues(bytes)
      },
   }

   const code = generateRandomString(random, "0123456789", 6)

   await tx.insert(emailVerificationRequest).values({
      userId,
      email,
      code,
      expiresAt: DateTime.createDate(new DateTime.TimeSpan(5, "m")),
   })

   return code
}

export const verifyEmailOTP = async (
   db: Database.Client,
   email: string,
   code: string,
) => {
   let isValid = true

   const databaseCode = await db.transaction(async (tx) => {
      const [databaseCode] = await tx
         .select()
         .from(emailVerificationRequest)
         .where(eq(emailVerificationRequest.email, email))

      if (!databaseCode || databaseCode.code !== code) {
         isValid = false
      }

      if (
         databaseCode &&
         !DateTime.isWithinExpirationDate(new Date(databaseCode.expiresAt))
      ) {
         isValid = false
      }

      if (databaseCode?.email !== email) {
         isValid = false
      }

      return databaseCode
   })

   if (databaseCode && isValid) {
      await db
         .delete(emailVerificationRequest)
         .where(eq(emailVerificationRequest.id, databaseCode.id))
   }

   return { userId: isValid ? databaseCode?.userId : null }
}
