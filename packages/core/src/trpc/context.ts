import type { AuthedHonoEnv } from "@project/core/api/types"
import type { Env } from "@project/infra/env"
import { initTRPC } from "@trpc/server"

export type TRPCContext = Omit<AuthedHonoEnv["Variables"], "env"> & {
   vars: Env
   host: string | null
}

const t = initTRPC.context<TRPCContext>().create()

export const router = t.router
export const procedure = t.procedure
