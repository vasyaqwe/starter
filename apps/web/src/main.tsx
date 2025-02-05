import "@project/ui/styles"
import { env } from "@/env"
import type { HonoError } from "@/lib/hono"
import { Button, buttonVariants } from "@project/ui/components/button"
import { TooltipProvider } from "@project/ui/components/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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
import type * as TauriAPI from "@tauri-apps/api"
import { ThemeProvider } from "next-themes"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { toast } from "sonner"
import { routeTree } from "./routeTree.gen"

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

const router = createTanStackRouter({
   routeTree,
   scrollRestoration: true,
   context: { queryClient },
   defaultPreload: "intent",
   defaultPendingMs: 150,
   defaultPendingMinMs: 200,
   defaultPreloadStaleTime: 0,
   defaultNotFoundComponent: NotFound,
   defaultErrorComponent: CatchBoundary,
})

function NotFound() {
   return (
      <div className="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
         <h1 className="mb-2 font-semibold text-xl">Not found</h1>
         <p className="mb-5 text-lg leading-snug opacity-70">
            This page does not exist — <br /> it may have been moved or deleted.
         </p>
         <Link
            to={"/"}
            className={buttonVariants()}
         >
            Back home
         </Link>
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
      <div className="flex grow flex-col items-center justify-center pt-20 text-center md:pt-40">
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
         {env.DEV ? (
            <div className="mx-auto mt-12 w-fit">
               <ErrorComponent error={error} />
            </div>
         ) : null}
      </div>
   )
}

declare global {
   var __TAURI_INTERNALS__: typeof TauriAPI
}

declare module "@tanstack/react-router" {
   interface Register {
      router: typeof router
   }
}

declare module "@tanstack/react-query" {
   interface Register {
      defaultError: HonoError
   }
}

// biome-ignore lint/style/noNonNullAssertion: ...
const rootElement = document.getElementById("app")!
if (!rootElement.innerHTML || rootElement.innerHTML.trim().length === 0) {
   const root = ReactDOM.createRoot(rootElement)
   root.render(
      <React.StrictMode>
         <ThemeProvider
            defaultTheme="light"
            attribute="class"
            enableSystem
            disableTransitionOnChange
         >
            <QueryClientProvider client={queryClient}>
               <TooltipProvider>
                  <RouterProvider router={router} />
               </TooltipProvider>
            </QueryClientProvider>
         </ThemeProvider>
      </React.StrictMode>,
   )
}
