import { Api } from "@project/core/api"
import { Auth } from "@project/core/auth"
import { Passkey } from "@project/core/passkey"

export const route = Api.createRouter()
   .use(Auth.middleware)
   .route("/passkey", Passkey.route)
   .get("/me", async (c) => {
      return c.json(c.var.user)
   })
   .post("/logout", async (c) => {
      Auth.deleteSessionTokenCookie(c)
      await Auth.invalidateSession(c, c.var.session.id)
      return c.json({ message: "OK" })
   })
