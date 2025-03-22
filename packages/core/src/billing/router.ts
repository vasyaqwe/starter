import { subscription } from "@project/core/billing/schema"
import { procedure, router } from "@project/core/trpc/context"
import { eq } from "drizzle-orm"

export const subscriptionRouter = router({
   one: procedure.query(async ({ ctx }) => {
      return (
         (await ctx.db.query.subscription.findFirst({
            where: eq(subscription.userID, ctx.user.id),
         })) ?? null
      )
   }),
})
