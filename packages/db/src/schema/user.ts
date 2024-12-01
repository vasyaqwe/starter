import { relations } from "drizzle-orm"
import {
   index,
   integer,
   primaryKey,
   text,
   uniqueIndex,
} from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { lifecycleDates, tableId } from "../utils"

export const user = pgTable(
   "user",
   {
      id: tableId("user"),
      email: text(),
      name: text(),
      avatarUrl: text(),
      emailVerified: integer().notNull().default(0),
      onboardingCompleted: integer().notNull().default(0),
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
      expiresAt: integer().notNull(),
      code: text().notNull(),
      userId: text().notNull(),
      email: text().notNull().unique(),
   },
   (table) => [index("email_verification_code_user_id_idx").on(table.userId)],
)

export const session = pgTable("session", {
   id: text().primaryKey(),
   expiresAt: integer().notNull(),
   userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
})

export const selectSessionInput = createSelectSchema(session)
export const selectUserInput = createSelectSchema(user)
export const insertUserInput = z
   .object({
      email: z.string().email(),
   })
   .extend({
      referralCode: z.string().optional(),
   })

export const insertOauthAccountInput = createInsertSchema(oauthAccount, {
   providerUserId: z.string().min(1),
}).omit({
   userId: true,
})

export const updateUserInput = createSelectSchema(user, {
   name: z.string().min(1),
}).partial()

export const verifyLoginCodeInput = createInsertSchema(
   emailVerificationCode,
).pick({
   code: true,
   userId: true,
})

export type Session = z.infer<typeof selectSessionInput>
export type User = z.infer<typeof selectUserInput>
export type OauthProvider = (typeof oauthProviders)[number]
export type SendLoginCodeInput = z.infer<typeof insertUserInput>
export type VerifyLoginCodeInput = z.infer<typeof verifyLoginCodeInput>
