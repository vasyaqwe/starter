import { Resend } from "resend"
import type { Env } from "./env"

export const Email = {
   client: (c: { var: { env: Env } }) => new Resend(c.var.env.RESEND_API_KEY),
   FROM: "Project <project@vasyldev.cc>",
}

export type EmailClient = ReturnType<typeof Email.client>
