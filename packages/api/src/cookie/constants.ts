import { env } from "@project/env"

export const cookieOptions = () => {
   return {
      httpOnly: true,
      secure: true,
      sameSite:
         env.server.NODE_ENV === "development"
            ? ("none" as const)
            : ("lax" as const),
   }
}
