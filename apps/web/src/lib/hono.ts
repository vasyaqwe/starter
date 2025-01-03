import type { AppRoutes } from "@project/api"
import type { ErrorCode } from "@project/api/error/schema"
import { type ClientResponse, hc as honoClient } from "hono/client"
import type { StatusCode } from "hono/utils/http-status"

export const hc = honoClient<AppRoutes>("http://localhost:8080", {
   init: {
      credentials: "include",
   },
})

type HonoResponse<T> = Promise<ClientResponse<T, StatusCode, "json">>

export const honoQueryFn = <T>(apiFn: () => HonoResponse<T>) => {
   return async () => {
      const res = await apiFn()
      if (res.ok) return res.json()
      return Promise.reject(await res.json())
   }
}

export const honoMutationFn = async <T>(
   res: ClientResponse<T, StatusCode, "json">,
) => {
   if (res.ok) return await res.json()
   return Promise.reject(await res.json())
}

export type HonoError = {
   code: ErrorCode
   message: string
}
