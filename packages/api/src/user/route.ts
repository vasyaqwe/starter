import { createRouter } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { deleteSessionTokenCookie, invalidateSession } from "./auth"

export const userRoute = createRouter()
   .use(authMiddleware)
   .get("/me", async (c) => {
      return c.json(c.var.user)
   })
   .post("/logout", async (c) => {
      deleteSessionTokenCookie(c)
      await invalidateSession(c, c.var.session.id)
      return c.json({ message: "OK" })
   })
