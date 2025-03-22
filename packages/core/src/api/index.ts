import { trpcServer } from "@hono/trpc-server"
import { createRouter } from "@project/core/api/utils"
import { authRouter } from "@project/core/auth/api"
import { authMiddleware } from "@project/core/auth/middleware"
import { billingRouter } from "@project/core/billing/api"
import { d } from "@project/core/database"
import { ApiError } from "@project/core/error"
import { storageRouter } from "@project/core/storage/api"
import { appRouter } from "@project/core/trpc"
import type { TRPCContext } from "@project/core/trpc/context"
import { emailClient } from "@project/infra/email"
import { env } from "@project/infra/env"
import { paymentClient } from "@project/infra/payment"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

const app = createRouter()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", env)
      c.set("db", d.client(c))
      c.set("email", emailClient(c))
      c.set("payment", paymentClient(c))
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [c.var.env.WEB_URL],
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
   .route("/billing", billingRouter)
   .route("/storage", storageRouter)

const auth = createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [c.var.env.WEB_URL],
      })
      return handler(c, next)
   })
   .route("/", authRouter)

export const routes = app
   .use(
      "/trpc/*",
      authMiddleware,
      trpcServer({
         router: appRouter,
         createContext: async (opts, c) => {
            return {
               vars: c.var.env,
               db: c.var.db,
               email: c.var.email,
               payment: c.var.payment,
               user: c.var.user,
               session: c.var.session,
               host: opts.req.headers.get("host"),
            } satisfies TRPCContext
         },
      }),
   )
   .route("/auth", auth)
   .route("/", base)
