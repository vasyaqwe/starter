import { hc, honoQueryFn } from "@/lib/hono"
import { queryOptions } from "@tanstack/react-query"

export const subscriptionByUserIdQuery = () =>
   queryOptions({
      queryKey: ["subscription_by_user_id"],
      queryFn: honoQueryFn(() => hc.billing.subscription.$get()),
   })
