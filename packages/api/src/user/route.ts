import { createRouter } from "../utils"
import { deleteSessionTokenCookie, invalidateSession } from "./auth"

export const userRoute = createRouter()
   .get("/me", async (c) => {
      return c.json(c.get("user"))
   })
   .post("/logout", async (c) => {
      deleteSessionTokenCookie(c)
      await invalidateSession(c, c.get("session").id)

      return c.json({ message: "OK" })
   })
