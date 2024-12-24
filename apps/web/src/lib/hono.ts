import type { AppRoutes } from "@project/api"
import { hc as honoClient } from "hono/client"

export const hc = honoClient<AppRoutes>("http://localhost:8080")

export const handleHonoResponse = async (res: Response) =>
   res.ok ? res.json() : Promise.reject(await res.json())

export type InferRequestInput<T> = T extends (data: infer U) => Promise<unknown>
   ? U
   : never
