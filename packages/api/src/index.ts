import { handleError } from "@project/api/error/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { authRoute } from "@project/api/user/auth/route"
import { userRoute } from "@project/api/user/route"
import { createRouter, zValidator } from "@project/api/utils"
import { db } from "@project/db/client"
import { env } from "@project/env"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"
import { z } from "zod"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

const app = createRouter()

app.use(logger())
   .use((c, next) => {
      const handler = cors({
         origin: [env.client.WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(handleError)

const publicRoutes = createRouter()
   .route("/auth", authRoute)
   .get("/hello", (c) => {
      return c.json({
         message: "Hello from Hono!",
      })
   })

const protectedRoutes = createRouter()
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
   .use(authMiddleware)
   // .use("*", async (c, next) => {
   //    const sentryMiddleware = sentry({
   //       enabled: env.server.NODE_ENV === "production",
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
   .route("/user", userRoute)
   .get(
      "/post/:id",
      zValidator(
         "param",
         z.object({
            id: z.string(),
         }),
      ),
      (c) => {
         const data = c.req.valid("param")
         return c.json({
            message: data,
         })
      },
   )
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

const routes = app.route("/api", publicRoutes).route("/", protectedRoutes)

export type AppRoutes = typeof routes

export default app
