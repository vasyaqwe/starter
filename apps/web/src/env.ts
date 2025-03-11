import { env_client } from "@project/infra/env/client"

const metaEnv = import.meta.env

export const env = {
   ...metaEnv,
   ...env_client[metaEnv.MODE as "development" | "production"],
}
