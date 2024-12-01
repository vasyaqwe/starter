import type { Database } from "@project/db/client"
import type { env } from "@project/env"
import type { Context } from "hono"

type Variables = {
   db: Database
}

export type AppContext = {
   Bindings: typeof env
   Variables: Variables
}

export type HonoContext = Context<AppContext>
