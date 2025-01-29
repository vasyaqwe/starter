import { Polar } from "@polar-sh/sdk"
import type { Env } from "@project/env"

export const payment = (c: { var: { env: Env } }) =>
   new Polar({
      accessToken: c.var.env.POLAR_ACCESS_TOKEN,
      server: "sandbox",
   })

export type Payment = ReturnType<typeof payment>
