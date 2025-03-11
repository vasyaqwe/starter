// @ts-nocheck
import { env } from "@project/infra/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
   dialect: "postgresql",
   schema: "./src/database/schema.ts",
   out: "./src/database/migrations",
   casing: "snake_case",
   dbCredentials: {
      url: env.DATABASE_URL,
   },
   verbose: true,
})
