import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const server = createEnv({
   server: {
      DATABASE_URL: z.string().min(1),
   },
   runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
   },
})

export const env = {
   server,
   client: {
      WEB_DOMAIN: "https://app.project.io",
   },
}
