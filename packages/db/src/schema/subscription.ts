import type { SubscriptionStatus } from "@polar-sh/sdk/src/models/components"
import { index, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { lifecycleDates, tableId } from "../utils"
import { user } from "./user"

export const subscriptionStatuses = [
   "active",
   "canceled",
   "incomplete",
   "incomplete_expired",
   "past_due",
   "trialing",
   "unpaid",
] as const satisfies SubscriptionStatus[]

export const subscription = pgTable(
   "subscription",
   {
      id: tableId("subscription"),
      userId: text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      status: text({
         enum: subscriptionStatuses,
      }).notNull(),
      customerId: varchar({
         length: 255,
      }).notNull(),
      priceId: varchar({
         length: 255,
      })
         .notNull()
         .unique(),
      productId: varchar({ length: 255 }).notNull(),
      currentPeriodStart: timestamp().notNull(),
      currentPeriodEnd: timestamp(),
      ...lifecycleDates,
   },
   (table) => [index("subscription_user_id_idx").on(table.userId)],
)
