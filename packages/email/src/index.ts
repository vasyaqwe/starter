import type { Env } from "@project/env"
import { Resend } from "resend"

export const EMAIL_FROM = "Project <project@vasyldev.cc>"

export const email = (c: { var: { env: Env } }) =>
   new Resend(c.var.env.server.RESEND_API_KEY)

export type Email = ReturnType<typeof email>
