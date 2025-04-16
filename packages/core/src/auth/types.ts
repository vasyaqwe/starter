import type { OAUTH_PROVIDERS } from "@project/core/auth/constants"
import type { session } from "@project/core/auth/schema"
import type { InferSelectModel } from "drizzle-orm"

export type Session = InferSelectModel<typeof session>
export type OauthProvider = (typeof OAUTH_PROVIDERS)[number]
