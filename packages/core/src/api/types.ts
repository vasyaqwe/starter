import type { routes } from "@project/core/api"
import type { Session } from "@project/core/auth/types"
import type { DatabaseClient } from "@project/core/database/core"
import type { User } from "@project/core/user/types"
import type { EmailClient } from "@project/infra/email"
import type { Env } from "@project/infra/env"
import type { PaymentClient } from "@project/infra/payment"

type Variables = {
   db: DatabaseClient
   email: EmailClient
   payment: PaymentClient
   env: Env
}

type AuthVariables = Variables & {
   user: User
   session: Session
}

export type HonoEnv = {
   Variables: Variables
}

export type AuthedHonoEnv = {
   Variables: AuthVariables
}

export type ApiRoutes = typeof routes
