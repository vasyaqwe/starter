// @ts-nocheck
import { Env } from "@project/infra/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
   dialect: "postgresql",
   schema: "./src/database/schema.ts",
   out: "./src/database/migrations",
   casing: "snake_case",
   dbCredentials: {
      url: Env.DATABASE_URL,
   },
   verbose: true,
})
