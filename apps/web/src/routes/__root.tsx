import { Toolbar } from "@/dev/components/toolbar"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { Toaster } from "@project/ui/components/toast"
import { useUIStore } from "@project/ui/store"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   createRootRouteWithContext,
   useMatches,
   useRouter,
} from "@tanstack/react-router"
import { useTheme } from "next-themes"
import * as React from "react"

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

   const [cursor] = useLocalStorage("cursor", "default")
   React.useEffect(() => {
      document.documentElement.style.setProperty("--cursor", cursor)
   }, [])

   return (
      <Meta>
         {/* <ModalProvider /> */}
         <Toolbar />
         <Toaster />
         <Outlet />
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
