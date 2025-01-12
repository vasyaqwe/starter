import "@project/ui/styles"
import type { HonoError } from "@/lib/hono"
import { Button, buttonVariants } from "@project/ui/components/button"
import { TooltipProvider } from "@project/ui/components/tooltip"
import { QueryClient } from "@tanstack/react-query"
import {
   ErrorComponent,
   type ErrorComponentProps,
   Link,
   RouterProvider,
   createRouter as createTanStackRouter,
   rootRouteId,
   useMatch,
   useRouter,
} from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import type * as TauriAPI from "@tauri-apps/api"
import { ThemeProvider } from "next-themes"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { toast } from "sonner"
import { routeTree } from "./routeTree.gen"

function createRouter() {
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
               return toast.error(error.message)
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
         defaultNotFoundComponent: NotFound,
         defaultErrorComponent: CatchBoundary,
      }),
      queryClient,
   )
}

function NotFound() {
   return (
      <div className="grid h-svh flex-1 place-items-center text-center">
         <div>
            <h1 className="mb-2 font-semibold text-xl">Not found</h1>
            <p className="mb-5 text-lg leading-snug opacity-70">
               This page does not exist — <br /> it may have been moved or
               deleted.
            </p>
            <Link
               to={"/"}
               className={buttonVariants()}
            >
               Back home
            </Link>
         </div>
      </div>
   )
}

function CatchBoundary({ error }: ErrorComponentProps) {
   const router = useRouter()
   const _isRoot = useMatch({
      strict: false,
      select: (state) => state.id === rootRouteId,
   })

   return (
      <div className="grid h-svh place-items-center text-center">
         {import.meta.env.DEV && (
            <div className="absolute top-0">
               <ErrorComponent error={error} />
            </div>
         )}

         <div>
            <h1 className="mb-2 font-semibold text-xl">An error occurred</h1>
            <p className="mb-5 text-lg leading-snug opacity-70">
               Please, try again.
            </p>
            <div className="flex items-center justify-center gap-2.5">
               <Button
                  onClick={() => {
                     router.invalidate()
                  }}
               >
                  Try Again
               </Button>
            </div>
         </div>
      </div>
   )
}

declare global {
   var __TAURI_INTERNALS__: typeof TauriAPI
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}

declare module "@tanstack/react-query" {
   interface Register {
      defaultError: HonoError
   }
}

// biome-ignore lint/style/noNonNullAssertion: ...
ReactDOM.createRoot(document.getElementById("app")!).render(
   <React.StrictMode>
      <ThemeProvider
         defaultTheme="light"
         attribute="class"
         enableSystem
         disableTransitionOnChange
      >
         <TooltipProvider>
            <RouterProvider router={createRouter()} />
         </TooltipProvider>
      </ThemeProvider>
   </React.StrictMode>,
)
