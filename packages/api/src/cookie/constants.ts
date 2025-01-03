import { env } from "@project/env"
import type { CookieOptions } from "hono/utils/cookie"

export const COOKIE_OPTIONS = {
   path: "/",
   httpOnly: true,
   secure: env.server.NODE_ENV === "production",
   maxAge: 600,
   sameSite: env.server.NODE_ENV === "production" ? "none" : "lax",
} satisfies CookieOptions
