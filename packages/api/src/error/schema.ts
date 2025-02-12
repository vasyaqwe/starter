import { z } from "zod"

export const errorCodeSchema = z.enum([
   "BAD_REQUEST",
   "FORBIDDEN",
   "INTERNAL_SERVER_ERROR",
   "USAGE_EXCEEDED",
   "DISABLED",
   "CONFLICT",
   "NOT_FOUND",
   "NOT_UNIQUE",
   "UNAUTHORIZED",
   "METHOD_NOT_ALLOWED",
   "UNPROCESSABLE_ENTITY",
   "TOO_MANY_REQUESTS",
])

export type ErrorCode = z.infer<typeof errorCodeSchema>
