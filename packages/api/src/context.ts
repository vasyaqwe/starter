import type { Database } from "@project/db/client"
import type { Session, User } from "@project/db/schema/user"
import type { Env } from "@project/env"
import type { Context } from "hono"

type Variables = {
   db: Database
   user: User
   session: Session
   env: Env
}

export type AppContext = {
   Bindings: Env
   Variables: Variables
}

export type HonoContext = Context<AppContext>
