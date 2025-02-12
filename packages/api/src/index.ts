import { billingRoute } from "@project/api/billing/route"
import { handleError } from "@project/api/error/utils"
import { createRouter } from "@project/api/misc/utils"
import { postRoute } from "@project/api/post/route"
import { storageRoute } from "@project/api/storage/route"
import { authRoute } from "@project/api/user/auth/route"
import { userRoute } from "@project/api/user/route"
import { db } from "@project/db/client"
import { email } from "@project/email"
import { env } from "@project/env"
import { payment } from "@project/payment"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

const app = createRouter()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", env)
      c.set("db", db(c))
      c.set("email", email(c))
      c.set("payment", payment(c))
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [c.var.env.WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(handleError)

const base = createRouter()
   .get("/health", (c) => {
      return c.json({
         message: "Healthy",
      })
   })
   .route("/billing", billingRoute)
   .route("/storage", storageRoute)
   .route("/user", userRoute)
   .route("/post", postRoute)

const auth = createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [c.var.env.WEB_DOMAIN, ...ALLOWED_ORIGINS],
      })
      return handler(c, next)
   })
   .route("/", authRoute)

const routes = app.route("/auth", auth).route("/", base)

export type AppRoutes = typeof routes

export default app
