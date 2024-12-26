import { BottomNavigation } from "@/routes/-components/bottom-navigation"
import { cn } from "@project/ui/utils"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   createRootRouteWithContext,
   useMatches,
} from "@tanstack/react-router"
import { useTheme } from "next-themes"
import * as React from "react"
import { Sidebar } from "./-components/sidebar"

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient
}>()({
   component: RootComponent,
   // pendingComponent: () => (
   //    <main className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
   //       <Logo className="mx-auto animate-fade-in opacity-0 [--animation-delay:100ms]" />
   //       <h1 className="mt-4 animate-fade-in text-center font-medium text-foreground/80 opacity-0 duration-500 [--animation-delay:600ms]">
   //          Workspace is loading...
   //       </h1>
   //    </main>
   // ),
})

function RootComponent() {
   const { resolvedTheme } = useTheme()

   React.useEffect(() => {
      if (resolvedTheme === "dark") {
         document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", "#0a0a0b")
      } else {
         document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", "#FFFFFF")
      }
   }, [resolvedTheme])

   return (
      <Meta>
         {/* <ModalProvider /> */}
         <Sidebar />
         <main
            className={cn(
               "flex h-[calc(100svh-var(--bottom-menu-height))] md:h-svh md:flex-1",
            )}
         >
            <div className={cn("relative flex flex-1 flex-col")}>
               <Outlet />
            </div>
         </main>
         <BottomNavigation />
      </Meta>
   )
}

function Meta({ children }: { children: React.ReactNode }) {
   const matches = useMatches()
   const meta = matches.at(-1)?.meta?.find((meta) => meta?.title)

   React.useEffect(() => {
      document.title = [meta?.title ?? "Project"].filter(Boolean).join(" · ")
   }, [meta])

   return children
}
