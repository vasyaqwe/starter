import { Resend } from "resend"
import type { Env } from "../env"

export const EMAIL_FROM = "Project <project@vasyldev.cc>"

export const email_client = (c: { var: { env: Env } }) =>
   new Resend(c.var.env.RESEND_API_KEY)

export type EmailClient = ReturnType<typeof email_client>
