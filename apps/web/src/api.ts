import { env } from "@/env"
import type { ApiErrorCode } from "@project/core/api/error"
import type { ApiRoutes } from "@project/core/api/types"
import { type ClientResponse, hc } from "hono/client"
import type { StatusCode } from "hono/utils/http-status"

export const api = hc<ApiRoutes>(env.API_URL, {
   init: {
      credentials: "include",
   },
})

type HonoResponse<T> = Promise<ClientResponse<T, StatusCode, "json">>

export const query =
   <T>(fn: () => HonoResponse<T>) =>
   async () => {
      const res = await fn()
      if (res.ok) return res.json()
      return Promise.reject(await res.json())
   }

export type ApiClientError = {
   code: ApiErrorCode
   message: string
}

export const CACHE_NONE = 0
export const CACHE_SHORT = 15 * 1000
export const CACHE_AWHILE = 5 * 60 * 1000
export const CACHE_FOREVER = Infinity
