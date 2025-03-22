import { type ID_PREFIXES, createID } from "@project/core/id"
import { customType, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const id = (prefix: keyof typeof ID_PREFIXES) =>
   text("id")
      .primaryKey()
      .$defaultFn(() => createID(prefix))

export const table = pgTable

export const timestamps = {
   createdAt: timestamp()
      .notNull()
      .$defaultFn(() => new Date()),
   updatedAt: timestamp()
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
}

export const bytea = customType<{ data: Uint8Array }>({
   dataType() {
      return "bytea"
   },
})
