import { trpc } from "@/trpc"
import { useSuspenseQuery } from "@tanstack/react-query"

export function useAuth() {
   const user = useSuspenseQuery(
      trpc.user.me.queryOptions(undefined, {
         staleTime: Infinity,
         retry: false,
      }),
   )

   return {
      user: user.data,
   }
}
