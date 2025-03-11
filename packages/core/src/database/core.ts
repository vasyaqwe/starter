export * from "./utils"
export * from "drizzle-orm/pg-core"
import type { Env } from "@project/infra/env"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export const database_client = (c: {
   var: { env: Env }
}) => {
   const client = postgres(c.var.env.DATABASE_URL)
   return drizzle({ client, casing: "snake_case", schema })
}

export type DatabaseClient = PostgresJsDatabase<typeof schema>
