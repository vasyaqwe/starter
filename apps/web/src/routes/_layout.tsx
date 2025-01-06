import { BottomNavigation } from "@/routes/-components/bottom-navigation"
import { Sidebar } from "@/routes/-components/sidebar"
import { userMeQuery } from "@/user/queries"
import { useUIStore } from "@project/ui/store"
import { cn } from "@project/ui/utils"
import {
   Outlet,
   createFileRoute,
   redirect,
   useRouter,
} from "@tanstack/react-router"
import * as React from "react"

export const Route = createFileRoute("/_layout")({
   component: RouteComponent,
   beforeLoad: async ({ context }) => {
      const user = await context.queryClient
         .ensureQueryData(userMeQuery())
         .catch(() => {
            throw redirect({ to: "/login" })
         })

      if (!user) throw redirect({ to: "/login" })
   },
})

function RouteComponent() {
   // for useCanGoForward
   const router = useRouter()
   const historyLength = useUIStore().historyLength
   React.useEffect(() => {
      return router.subscribe("onBeforeNavigate", () => {
         const currentIndex = router.state.location.state.__TSR_index
         if (currentIndex >= historyLength) {
            useUIStore.setState({ historyLength: currentIndex + 1 })
         }
      })
   }, [historyLength])

   return (
      <>
         <Sidebar />
         <main
            className={cn(
               "flex h-[calc(100svh-var(--bottom-navigation-height))] md:h-svh md:flex-1",
            )}
         >
            <div className={cn("relative flex flex-1 flex-col")}>
               <Outlet />
            </div>
         </main>
         <BottomNavigation />
      </>
   )
}
