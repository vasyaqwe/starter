import { type RandomReader, generateRandomString } from "@oslojs/crypto/random"
import { sha256 } from "@oslojs/crypto/sha2"
import {
   encodeBase32LowerCaseNoPadding,
   encodeHexLowerCase,
} from "@oslojs/encoding"
import type { AuthedHonoEnv, HonoEnv } from "@project/core/api/types"
import { COOKIE_OPTIONS } from "@project/core/cookie/constants"
import type { DatabaseClient } from "@project/core/database/core"
import {
   emailVerificationRequest,
   session,
} from "@project/core/database/schema"
import {
   TimeSpan,
   date_create,
   date_isWithinExpiration,
} from "@project/core/date"
import { eq } from "drizzle-orm"
import type { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { SESSION_COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from "./constants"

export const auth_createSession = async (
   c: Context<HonoEnv>,
   userId: string,
) => {
   const token = auth_generateSessionToken()
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

   await c
      .get("db")
      .insert(session)
      .values({
         id: sessionId,
         userId: userId,
         expiresAt: new Date(Date.now() + 1000 * SESSION_EXPIRATION_SECONDS),
      })

   auth_setSessionTokenCookie(c, token)
}

export const auth_getSessionTokenCookie = (c: Context) =>
   getCookie(c, SESSION_COOKIE_NAME)

export const auth_setSessionTokenCookie = (c: Context, token: string) => {
   setCookie(c, SESSION_COOKIE_NAME, token, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRATION_SECONDS,
   })
}

export const auth_deleteSessionTokenCookie = (c: Context) => {
   setCookie(c, SESSION_COOKIE_NAME, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
   })
}

export const auth_generateSessionToken = () => {
   const bytes = new Uint8Array(20)
   crypto.getRandomValues(bytes)
   const token = encodeBase32LowerCaseNoPadding(bytes)
   return token
}

export const auth_invalidateSession = async (
   c: Context<AuthedHonoEnv>,
   sessionId: string,
) => await c.var.db.delete(session).where(eq(session.id, sessionId))

export const auth_generateEmailOTP = async ({
   tx,
   userId,
   email,
}: {
   tx: DatabaseClient
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
      expiresAt: date_create(new TimeSpan(5, "m")),
   })

   return code
}

export const auth_verifyEmailOTP = async (
   db: DatabaseClient,
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
         !date_isWithinExpiration(new Date(databaseCode.expiresAt))
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
