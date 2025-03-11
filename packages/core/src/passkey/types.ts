import type { passkeyCredential } from "@project/core/passkey/schema"
import type { InferSelectModel } from "drizzle-orm"

export type PasskeyCredential = InferSelectModel<typeof passkeyCredential>
