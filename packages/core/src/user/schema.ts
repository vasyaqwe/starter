import { oauthAccount } from "@project/core/auth/schema"
import { d } from "@project/core/database"
import { relations } from "drizzle-orm"

export const user = d.table(
   "user",
   {
      id: d.id("user"),
      email: d.text().notNull(),
      name: d.text().notNull().default(""),
      avatarUrl: d.text(),
      emailVerified: d.boolean().notNull().default(false),
      onboardingCompleted: d.boolean().notNull().default(false),
      ...d.timestamps,
   },
   (table) => [d.uniqueIndex("user_email_idx").on(table.email)],
)

export const userRelations = relations(user, ({ many }) => ({
   oauthAccount: many(oauthAccount),
}))
