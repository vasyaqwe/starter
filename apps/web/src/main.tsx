import "@project/ui/styles.css"
import type { ErrorCode } from "@project/api/error/schema"
import * as Portal from "@radix-ui/react-portal"
import { QueryClient } from "@tanstack/react-query"
// import { Toaster, toast} from "@project/ui/components/toast"
import {
   RouterProvider,
   createRouter as createTanStackRouter,
} from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"

export function createRouter() {
   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            retry(failureCount) {
               // 2 max
               return failureCount < 1
            },
            // 15 min
            staleTime: 900 * 1000,
         },
         mutations: {
            onError: (error) => {
               console.log(error)
               window.alert(error.message)
               // return toast.error("An unknown error occurred")
            },
         },
      },
   })
   return routerWithQueryClient(
      createTanStackRouter({
         routeTree,
         context: { queryClient },
         defaultPreload: "intent",
         defaultPendingMs: 150,
         defaultPendingMinMs: 200,
         defaultPreloadStaleTime: 0,
      }),
      queryClient,
   )
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}

declare module "@tanstack/react-query" {
   interface Register {
      defaultError: {
         code: ErrorCode
         message: string
      }
   }
}

// biome-ignore lint/style/noNonNullAssertion: ...
ReactDOM.createRoot(document.getElementById("app")!).render(
   <React.StrictMode>
      <>
         <RouterProvider router={createRouter()} />
         <Portal.Root>{/* <Toaster /> */}</Portal.Root>
      </>
   </React.StrictMode>,
)
