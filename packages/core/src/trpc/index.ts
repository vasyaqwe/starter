import { subscriptionRouter } from "@project/core/billing/router"
import { passkeyRouter } from "@project/core/passkey/router"
import { router } from "@project/core/trpc/context"
import { userRouter } from "@project/core/user/router"

export const appRouter = router({
   user: userRouter,
   passkey: passkeyRouter,
   subscription: subscriptionRouter,
})

export type AppRouter = typeof appRouter
