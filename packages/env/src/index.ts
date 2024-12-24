import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const server = createEnv({
   server: {
      NODE_ENV: z.enum(["development", "production"]).default("development"),
      DATABASE_URL: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
   },
   runtimeEnv: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
   },
})

export const env = {
   server,
   client: {
      SERVER_DOMAIN:
         process.env.NODE_ENV === "production"
            ? "https://api.project.io"
            : "http://localhost:8080",
      WEB_DOMAIN:
         process.env.NODE_ENV === "production"
            ? "https://app.project.io"
            : "http://localhost:3000",
   },
}

export type Env = typeof env
