import type { SubscriptionStatus } from "@polar-sh/sdk/src/models/components"
import { d } from "@project/core/database"
import { user } from "@project/core/user/schema"

const SUBSCRIPTION_STATUSES = [
   "active",
   "canceled",
   "incomplete",
   "incomplete_expired",
   "past_due",
   "trialing",
   "unpaid",
] as const satisfies SubscriptionStatus[]

export const subscription = d.table(
   "subscription",
   {
      id: d.text().notNull().primaryKey(),
      userId: d
         .text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      status: d
         .text({
            enum: SUBSCRIPTION_STATUSES,
         })
         .notNull(),
      customerId: d.text().notNull(),
      priceId: d.text().notNull(),
      productId: d.text().notNull(),
      currentPeriodStart: d.timestamp().notNull(),
      currentPeriodEnd: d.timestamp(),
      cancelAtPeriodEnd: d.boolean().default(false),
      ...d.timestamps,
   },
   (table) => [
      d.index("subscription_user_id_idx").on(table.userId),
      d
         .unique("subscription_user_id_product_id_idx")
         .on(table.userId, table.productId),
   ],
)
