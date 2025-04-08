import { Resend } from "resend"
import type { Env } from "../env"

export const EMAIL_FROM = "Project <project@vasyaqwe.com>"

export const emailClient = (c: { var: { env: Env } }) =>
   new Resend(c.var.env.RESEND_API_KEY)

export type EmailClient = ReturnType<typeof emailClient>
