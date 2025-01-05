import type { Database } from "@project/db/client"
import type { Session, User } from "@project/db/schema/user"
import type { Email } from "@project/email"
import type { Env } from "@project/env"
import type { Payment } from "@project/payment"
import type { Context } from "hono"

type Variables = {
   db: Database
   email: Email
   payment: Payment
   env: Env
}

export type AuthVariables = { user: User; session: Session }

export type AppContext = {
   Variables: Variables
}

export type AuthedAppContext = {
   Variables: Variables & AuthVariables
}

export type HonoContext = Context<AppContext>
export type AuthedHonoContext = Context<AuthedAppContext>
