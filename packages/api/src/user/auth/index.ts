import { type RandomReader, generateRandomString } from "@oslojs/crypto/random"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import type { HonoContext } from "@project/api/context"
import { cookieOptions } from "@project/api/cookie/constants"
import { TimeSpan, createDate, isWithinExpirationDate } from "@project/api/date"
import { eq } from "@project/db"
import type { Database } from "@project/db/client"
import { emailVerificationCode, session } from "@project/db/schema/user"
import { getCookie, setCookie } from "hono/cookie"
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from "./constants"

export const createSession = async (c: HonoContext, userId: string) => {
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
      .returning()

   setSessionTokenCookie(c, token)
}

export const getSessionTokenCookie = (c: HonoContext) =>
   getCookie(c, SESSION_COOKIE_NAME)

export const setSessionTokenCookie = (c: HonoContext, token: string) => {
   setCookie(c, SESSION_COOKIE_NAME, token, {
      ...cookieOptions(),
      maxAge: Date.now() + 1000 * SESSION_EXPIRATION_SECONDS,
   })
}

export const deleteSessionTokenCookie = (c: HonoContext) => {
   setCookie(c, SESSION_COOKIE_NAME, "", {
      ...cookieOptions(),
      maxAge: 0,
   })
}

export const generateSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

export const invalidateSession = async (c: HonoContext, sessionId: string) =>
   await c.get("db").delete(session).where(eq(session.id, sessionId))

export const generateEmailOTP = async ({
   tx,
   userId,
   email,
}: {
   tx: Database
   userId: string
   email: string
}) => {
   await tx
      .delete(emailVerificationCode)
      .where(eq(emailVerificationCode.email, email))

   const random: RandomReader = {
      read(bytes) {
         crypto.getRandomValues(bytes)
      },
   }

   const code = generateRandomString(random, "0123456789", 6)

   await tx.insert(emailVerificationCode).values({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")),
   })
}

export const verifyEmailOTP = async (
   db: Database,
   userId: string,
   code: string,
) => {
   let isValid = true

   const databaseCode = await db.transaction(async (tx) => {
      const [databaseCode] = await tx
         .select()
         .from(emailVerificationCode)
         .where(eq(emailVerificationCode.userId, userId))

      if (!databaseCode || databaseCode.code !== code) {
         isValid = false
      }

      if (
         databaseCode &&
         !isWithinExpirationDate(new Date(databaseCode.expiresAt))
      ) {
         isValid = false
      }

      if (databaseCode?.userId !== userId) {
         isValid = false
      }

      return databaseCode
   })

   if (databaseCode && isValid) {
      await db
         .delete(emailVerificationCode)
         .where(eq(emailVerificationCode.id, databaseCode.id))
   }

   return isValid
}
