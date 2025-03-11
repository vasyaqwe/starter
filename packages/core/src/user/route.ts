import { api_createRouter } from "@project/core/api/utils"
import {
   auth_deleteSessionTokenCookie,
   auth_invalidateSession,
} from "@project/core/auth"
import { auth_middleware } from "@project/core/auth/middleware"
import { passkey_route } from "@project/core/passkey/route"

export const user_route = api_createRouter()
   .use(auth_middleware)
   .route("/passkey", passkey_route)
   .get("/me", async (c) => {
      return c.json(c.var.user)
   })
   .post("/logout", async (c) => {
      auth_deleteSessionTokenCookie(c)
      await auth_invalidateSession(c, c.var.session.id)
      return c.json({ message: "OK" })
   })
