import { env } from "@project/env"

export const COOKIE_OPTIONS = {
   httpOnly: true,
   secure: true,
   maxAge: 600,
   sameSite:
      env.server.NODE_ENV === "development"
         ? ("none" as const)
         : ("lax" as const),
}
