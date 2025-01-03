import { type InferSelectModel, relations } from "drizzle-orm"
import {
   boolean,
   index,
   primaryKey,
   text,
   timestamp,
   uniqueIndex,
} from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { lifecycleDates, tableId } from "../utils"

export const user = pgTable(
   "user",
   {
      id: tableId("user"),
      email: text(),
      name: text(),
      avatarUrl: text(),
      emailVerified: boolean().notNull().default(false),
      onboardingCompleted: boolean().notNull().default(false),
      ...lifecycleDates,
   },
   (table) => [uniqueIndex("user_email_idx").on(table.email)],
)

export const oauthProviders = ["google", "github"] as const

export const oauthAccount = pgTable(
   "oauth_account",
   {
      userId: text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      providerId: text({
         enum: oauthProviders,
      }).notNull(),
      providerUserId: text().notNull().unique(),
   },
   (table) => [
      primaryKey({ columns: [table.providerId, table.providerUserId] }),
   ],
)

export const userRelations = relations(user, ({ many }) => ({
   oauthAccount: many(oauthAccount),
}))

export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
   user: one(user, {
      fields: [oauthAccount.userId],
      references: [user.id],
   }),
}))

export const emailVerificationCode = pgTable(
   "email_verification_code",
   {
      id: tableId("verification_code"),
      expiresAt: timestamp().notNull(),
      code: text().notNull(),
      userId: text().notNull(),
      email: text().notNull().unique(),
   },
   (table) => [index("email_verification_code_user_id_idx").on(table.userId)],
)

export const session = pgTable("session", {
   id: text().primaryKey(),
   expiresAt: timestamp().notNull(),
   userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
})

export const verifyLoginOTPInput = createSelectSchema(
   emailVerificationCode,
).pick({
   code: true,
   email: true,
})

export type Session = InferSelectModel<typeof session>
export type User = InferSelectModel<typeof user>
export type OauthProvider = (typeof oauthProviders)[number]
