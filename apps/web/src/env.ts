import { clientEnv } from "@project/infra/env/client"

const metaEnv = import.meta.env

export const env = {
   ...metaEnv,
   ...clientEnv[metaEnv.MODE as "development" | "production"],
}
