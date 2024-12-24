import "@project/ui/styles.css"
import type { ErrorCode } from "@project/api/error/schema"
import { Button, buttonVariants } from "@project/ui/components/button"
import * as Portal from "@radix-ui/react-portal"
import { QueryClient } from "@tanstack/react-query"
// import { Toaster, toast } from "@project/ui/components/toast"
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
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
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
         defaultPendingComponent: () => (
            <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
               {/* <Icons.logo className="mx-auto size-6 animate-fade-in opacity-0 drop-shadow-md [--animation-delay:100ms]" /> */}
               <h1 className="mt-5 animate-fade-in text-center font-medium text-gray-11 opacity-0 duration-500 [--animation-delay:500ms]">
                  Workspace is loading..
               </h1>
            </div>
         ),
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
      <ThemeProvider
         defaultTheme="light"
         attribute="class"
         enableSystem
         disableTransitionOnChange
      >
         <RouterProvider router={createRouter()} />
         <Portal.Root>{/* <Toaster /> */}</Portal.Root>
      </ThemeProvider>
   </React.StrictMode>,
)
