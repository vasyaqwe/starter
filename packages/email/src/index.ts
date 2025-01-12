import { env } from "@project/env"
import { Resend } from "resend"

export const EMAIL_FROM = "Project <project@vasyldev.cc>"

export const email = new Resend(env.server.RESEND_API_KEY)

export type Email = typeof email
