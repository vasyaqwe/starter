import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const server = createEnv({
   server: {
      NODE_ENV: z.enum(["development", "production"]).default("development"),
      DATABASE_URL: z.string().min(1),
   },
   runtimeEnv: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
   },
})

export const env = {
   server,
   client: {
      WEB_DOMAIN:
         process.env.NODE_ENV === "production"
            ? "https://app.project.io"
            : "http://localhost:3000",
   },
}
