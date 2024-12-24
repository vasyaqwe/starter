import { sha256 } from "@oslojs/crypto/sha2"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { eq } from "@project/db"
import { session, user } from "@project/db/schema/user"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import {
   deleteSessionTokenCookie,
   getSessionTokenCookie,
   setSessionTokenCookie,
} from "."
import type { HonoContext } from "../../context"
import { SESSION_EXPIRATION_SECONDS } from "./constants"

const validateSessionToken = async (c: HonoContext, token: string) => {
   const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

   const db = c.get("db")

   const [found] = await db
      .select({ foundUser: user, foundSession: session })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(eq(session.id, sessionId))

   if (!found) return { session: null, user: null }

   const { foundUser, foundSession } = found

   if (Date.now() >= foundSession.expiresAt.getTime()) {
      await db.delete(session).where(eq(session.id, foundSession.id))
      return { session: null, user: null }
   }

   // If less than 15 days remaining, extend the expiry
   if (
      Date.now() >=
      foundSession.expiresAt.getTime() - 1000 * 15 * 24 * 60 * 60
   ) {
      foundSession.expiresAt = new Date(
         Date.now() + 1000 * SESSION_EXPIRATION_SECONDS,
      )
      await db
         .update(session)
         .set({
            expiresAt: foundSession.expiresAt,
         })
         .where(eq(session.id, foundSession.id))
      setSessionTokenCookie(c, token)
   }

   return { session: foundSession, user: foundUser }
}

export const authMiddleware = createMiddleware(async (c, next) => {
   const sessionToken = getSessionTokenCookie(c)
   if (!sessionToken) {
      throw new HTTPException(401, {
         message: "Unauthorized",
      })
   }

   const { session, user } = await validateSessionToken(c, sessionToken)
   if (!session || !user) {
      deleteSessionTokenCookie(c)
      throw new HTTPException(401, {
         message: "Unauthorized",
      })
   }

   c.set("user", user)
   c.set("session", session)

   return next()
})
