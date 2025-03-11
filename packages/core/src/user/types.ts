import type { user } from "@project/core/user/schema"
import type { InferSelectModel } from "drizzle-orm"

export type User = InferSelectModel<typeof user>
