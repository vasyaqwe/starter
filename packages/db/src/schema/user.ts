import { type InferSelectModel, relations } from "drizzle-orm"
import {
   boolean,
   index,
   integer,
   primaryKey,
   text,
   timestamp,
   uniqueIndex,
} from "drizzle-orm/pg-core"
import { pgTable } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { bytea, lifecycleDates, tableId } from "../utils"

export const user = pgTable(
   "user",
   {
      id: tableId("user"),
      email: text().notNull(),
      name: text().notNull().default(""),
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

export const emailVerificationRequest = pgTable(
   "email_verification_request",
   {
      id: tableId("verification_request"),
      userId: text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      email: text().notNull().unique(),
      code: text().notNull(),
      expiresAt: timestamp().notNull(),
   },
   (table) => [
      index("email_verification_request_user_id_idx").on(table.userId),
   ],
)

export const passkeyCredential = pgTable(
   "passkey_credential",
   {
      id: bytea().primaryKey(),
      userId: text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
      name: text().notNull(),
      algorithm: integer().notNull(),
      publicKey: bytea().notNull(),
   },
   (table) => [index("passkey_credential_user_id_idx").on(table.userId)],
)

export const session = pgTable(
   "session",
   {
      id: text().primaryKey(),
      expiresAt: timestamp().notNull(),
      userId: text()
         .notNull()
         .references(() => user.id, { onDelete: "cascade" }),
   },
   (table) => [index("session_user_id_idx").on(table.userId)],
)

export const verifyLoginOTPInput = createSelectSchema(
   emailVerificationRequest,
).pick({
   code: true,
   email: true,
})

export type Session = InferSelectModel<typeof session>
export type User = InferSelectModel<typeof user>
export type PasskeyCredential = InferSelectModel<typeof passkeyCredential>
export type OauthProvider = (typeof oauthProviders)[number]
