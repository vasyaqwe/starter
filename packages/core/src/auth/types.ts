import type { session } from "@project/core/auth/schema"
import type { InferSelectModel } from "drizzle-orm"

export type Session = InferSelectModel<typeof session>
