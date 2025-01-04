import { Polar } from "@polar-sh/sdk"
import { env } from "@project/env"

export const payment = new Polar({
   accessToken: env.server.POLAR_ACCESS_TOKEN,
   server: "sandbox",
})

export type Payment = typeof payment
