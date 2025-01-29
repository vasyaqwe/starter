import type { Env } from "@project/env"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export const db = (c: {
   var: { env: Env }
}) => {
   const client = postgres(c.var.env.server.DATABASE_URL)
   return drizzle({ client, casing: "snake_case", schema })
}

export type Database = PostgresJsDatabase<typeof schema>
