import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const server = createEnv({
   server: {
      NODE_ENV: z.enum(["development", "production"]).default("development"),
      DATABASE_URL: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
      RESEND_API_KEY: z.string().min(1),
      POLAR_ACCESS_TOKEN: z.string().min(1),
      POLAR_ORGANIZATION_ID: z.string().min(1),
      POLAR_WEBHOOK_SECRET: z.string().min(1),
      R2_ACCESS_KEY_ID: z.string().min(1),
      R2_SECRET_ACCESS_KEY: z.string().min(1),
   },
   runtimeEnv: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
      POLAR_ORGANIZATION_ID: process.env.POLAR_ORGANIZATION_ID,
      POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
   },
})

export const env = {
   server,
   client: {
      STORAGE_DOMAIN: "https://pub-adc2676146514653aefef032cae1fc9d.r2.dev",
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
