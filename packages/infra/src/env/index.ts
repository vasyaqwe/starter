import { clientEnv } from "./client"
import { serverEnv } from "./server"

const all = {
   development: {
      ...serverEnv,
      ...clientEnv.development,
   },
   production: {
      ...serverEnv,
      ...clientEnv.production,
   },
} as const

export const env = all[serverEnv.NODE_ENV]

export type Env = typeof env
