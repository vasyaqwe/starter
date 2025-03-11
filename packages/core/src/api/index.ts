import { api_createRouter } from "@project/core/api/utils"
import { auth_route } from "@project/core/auth/route"
import { billing_route } from "@project/core/billing/route"
import { database_client } from "@project/core/database/core"
import { ApiError } from "@project/core/error"
import { post_route } from "@project/core/post/route"
import { storage_route } from "@project/core/storage/route"
import { user_route } from "@project/core/user/route"
import { email_client } from "@project/infra/email"
import { env } from "@project/infra/env"
import { payment_client } from "@project/infra/payment"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

const app = api_createRouter()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", env)
      c.set("db", database_client(c))
      c.set("email", email_client(c))
      c.set("payment", payment_client(c))
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [c.var.env.WEB_DOMAIN],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(ApiError.handle)

const base = api_createRouter()
   .get("/health", (c) => {
      return c.json({
         message: "Healthy",
      })
   })
   .route("/billing", billing_route)
   .route("/storage", storage_route)
   .route("/user", user_route)
   .route("/post", post_route)

const auth = api_createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [c.var.env.WEB_DOMAIN],
      })
      return handler(c, next)
   })
   .route("/", auth_route)

export const routes = app.route("/auth", auth).route("/", base)
