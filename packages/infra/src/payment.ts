import { Polar } from "@polar-sh/sdk"
import type { Env } from "./env"

export const paymentClient = (c: { var: { env: Env } }) =>
   new Polar({
      accessToken: c.var.env.POLAR_ACCESS_TOKEN,
      server: "sandbox",
   })

export type PaymentClient = ReturnType<typeof paymentClient>
