import { createRouter } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { passkeyRoute } from "@project/api/user/auth/passkey/route"
import { deleteSessionTokenCookie, invalidateSession } from "./auth"

export const userRoute = createRouter()
   .use(authMiddleware)
   .route("/passkey", passkeyRoute)
   .get("/me", async (c) => {
      return c.json(c.var.user)
   })
   .post("/logout", async (c) => {
      deleteSessionTokenCookie(c)
      await invalidateSession(c, c.var.session.id)
      return c.json({ message: "OK" })
   })
