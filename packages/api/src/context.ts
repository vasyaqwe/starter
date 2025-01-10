import type { Database } from "@project/db/client"
import type { Session, User } from "@project/db/schema/user"
import type { Email } from "@project/email"
import type { Env } from "@project/env"
import type { Payment } from "@project/payment"

type Variables = {
   db: Database
   email: Email
   payment: Payment
   env: Env
}

type AuthVariables = { user: User; session: Session }

export type HonoEnv = {
   Variables: Variables
}

export type AuthedHonoEnv = {
   Variables: Variables & AuthVariables
}
