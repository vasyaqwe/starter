import { BottomNavigation } from "@/routes/-components/bottom-navigation"
import { Sidebar } from "@/routes/-components/sidebar"
import { trpc } from "@/trpc"
import { historyLengthAtom } from "@project/ui/store"
import { cn } from "@project/ui/utils"
import {
   Outlet,
   createFileRoute,
   redirect,
   useRouter,
} from "@tanstack/react-router"
import { useAtom } from "jotai"
import * as React from "react"

export const Route = createFileRoute("/_layout")({
   component: RouteComponent,
   beforeLoad: async ({ context }) => {
      const user = await context.queryClient
         .ensureQueryData(
            trpc.user.me.queryOptions(undefined, {
               staleTime: Infinity,
               retry: false,
            }),
         )
         .catch(() => {
            throw redirect({ to: "/login" })
         })

      if (!user) throw redirect({ to: "/login" })
   },
   pendingComponent: () => (
      <main className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         {/* <Logo className="mx-auto animate-fade-in opacity-0 [--animation-delay:100ms]" /> */}
         <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 duration-500 [--animation-delay:600ms]">
            Workspace is loading...
         </h1>
      </main>
   ),
})

function RouteComponent() {
   // for useCanGoForward
   const router = useRouter()
   const [historyLength, setHistoryLength] = useAtom(historyLengthAtom)
   React.useEffect(() => {
      return router.subscribe("onBeforeNavigate", () => {
         const currentIndex = router.state.location.state.__TSR_index
         if (currentIndex >= historyLength) {
            setHistoryLength(currentIndex + 1)
         }
      })
   }, [historyLength])

   return (
      <>
         <Sidebar />
         <main
            className={cn(
               "flex h-[calc(100svh-var(--bottom-navigation-height))] md:h-svh md:grow",
            )}
         >
            <div className={cn("relative flex grow flex-col")}>
               <Outlet />
            </div>
         </main>
         <BottomNavigation />
      </>
   )
}
