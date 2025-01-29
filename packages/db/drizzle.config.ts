// @ts-nocheck
import { env } from "@project/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
   dialect: "postgresql",
   schema: "./src/schema/**/*.ts",
   out: "./src/migrations",
   casing: "snake_case",
   dbCredentials: {
      url: env.server.DATABASE_URL,
   },
   verbose: true,
})
