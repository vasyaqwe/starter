import { db } from "@project/db/client"
import { env } from "@project/env"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"
import { z } from "zod"
import type { AppContext } from "./context"
import { handleError } from "./error/utils"
import { zValidator } from "./utils"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

const app = new Hono<AppContext>()

app.use(logger())
   .use((c, next) => {
      const handler = cors({
         origin: [env.client.WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .use((c, next) => {
      const handler = csrf({
         origin: [env.client.WEB_DOMAIN, ...ALLOWED_ORIGINS],
      })
      return handler(c, next)
   })
   .use((c, next) => {
      c.set("db", db)
      return next()
   })
   // .use("*", async (c, next) => {
   //    const sentryMiddleware = sentry({
   //       enabled: c.env.ENVIRONMENT === "production",
   //    })
   //    return await sentryMiddleware(c, next)
   // })
   // for local R2 bucket
   // .get("/r2/*", async (c) => {
   //    const key = c.req.path.substring("/r2/".length)
   //    const file = await c.env.STORAGE_BUCKET.get(key)
   //    if (!file) return c.json({ status: 404 })
   //    const headers = new Headers()
   //    headers.append("etag", file.httpEtag)
   //    return new Response(file.body, {
   //       headers,
   //    })
   // })
   .onError(handleError)

const routes = app
   .get("/hello", (c) => {
      return c.json({
         message: "Hello from Hono!",
      })
   })
   .post(
      "/post",
      zValidator(
         "json",
         z.object({
            someData: z.string(),
         }),
      ),
      (c) => {
         const data = c.req.valid("json")
         return c.json({
            message: data,
         })
      },
   )

export type AppRoutes = typeof routes

export default app
