import { billingRouter } from "@project/core/billing/trpc"
import { passkeyRouter } from "@project/core/passkey/trpc"
import { router } from "@project/core/trpc/context"
import { userRouter } from "@project/core/user/trpc"

export const appRouter = router({
   user: userRouter,
   passkey: passkeyRouter,
   subscription: billingRouter,
})

export type AppRouter = typeof appRouter
