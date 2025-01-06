import { hc, honoQueryFn } from "@/lib/hono"
import { queryOptions } from "@tanstack/react-query"

export const userMeQuery = () =>
   queryOptions({
      queryKey: ["user_me"],
      queryFn: honoQueryFn(() => hc.user.me.$get()),
      staleTime: Infinity,
      retry: false,
   })
