import { procedure, router } from "@project/core/trpc/context"

export const userRouter = router({
   me: procedure.query(({ ctx }) => {
      return ctx.user
   }),
})
