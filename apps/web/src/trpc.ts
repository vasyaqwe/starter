import { env } from "@/env"
import type { AppRouter } from "@project/core/trpc"
import { MutationCache, QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import {
   createTRPCContext,
   createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query"
import { toast } from "sonner"

export const { TRPCProvider, useTRPC, useTRPCClient } =
   createTRPCContext<AppRouter>()

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry(failureCount) {
            return failureCount < 1 // 2 max
         },
         staleTime: 10 * 60 * 1000,
      },
      mutations: {
         onError: (error) => {
            return toast.error(error.message)
         },
      },
   },
   // handle hono RPC errors
   mutationCache: new MutationCache({
      onSuccess: async (res) => {
         if (!(res instanceof Response)) return
         if (res.ok) return
         return Promise.reject(await res.json())
      },
   }),
})

export const client = createTRPCClient<AppRouter>({
   links: [
      httpBatchLink({
         url: `${env.API_URL}/trpc`,
         fetch(url, options) {
            return fetch(url, {
               ...options,
               credentials: "include",
            })
         },
      }),
   ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
   client,
   queryClient,
})
