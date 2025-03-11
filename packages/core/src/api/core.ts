export * from "./utils"
import { createRouter } from "@project/core/api/utils"
import { Auth } from "@project/core/auth"
import { Billing } from "@project/core/billing"
import { Database } from "@project/core/database"
import { ApiError } from "@project/core/error"
import { Post } from "@project/core/post"
import { Storage } from "@project/core/storage"
import { User } from "@project/core/user"
import { Email, type EmailClient } from "@project/infra/email"
import { Env } from "@project/infra/env"
import { Payment, type PaymentClient } from "@project/infra/payment"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

type Variables = {
   db: Database.Client
   email: EmailClient
   payment: PaymentClient
   env: Env
}

type AuthVariables = Variables & {
   user: User.Schema
   session: User.SessionSchema
}

export type HonoEnv = {
   Variables: Variables
}

export type AuthedHonoEnv = {
   Variables: AuthVariables
}

const app = createRouter()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", Env)
      c.set("db", Database.client(c))
      c.set("email", Email.client(c))
      c.set("payment", Payment.client(c))
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

const base = createRouter()
   .get("/health", (c) => {
      return c.json({
         message: "Healthy",
      })
   })
   .route("/billing", Billing.route)
   .route("/storage", Storage.route)
   .route("/user", User.route)
   .route("/post", Post.route)

const auth = createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [c.var.env.WEB_DOMAIN],
      })
      return handler(c, next)
   })
   .route("/", Auth.route)

export const routes = app.route("/auth", auth).route("/", base)

export type Routes = typeof routes
