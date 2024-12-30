import { BottomNavigation } from "@/routes/-components/bottom-navigation"
import { Sidebar } from "@/routes/-components/sidebar"
import { cn } from "@project/ui/utils"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout")({
   component: RouteComponent,
})

function RouteComponent() {
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
