import { Toolbar } from "@/dev/components/toolbar"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { Toaster } from "@project/ui/components/toast"
import { MOBILE_BREAKPOINT } from "@project/ui/constants"
import { isMobileAtom } from "@project/ui/store"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   createRootRouteWithContext,
   useMatches,
} from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import { useTheme } from "next-themes"
import * as React from "react"

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient
}>()({
   component: RootComponent,
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

   const setIsMobile = useSetAtom(isMobileAtom)
   React.useEffect(() => {
      const checkDevice = (event: MediaQueryList | MediaQueryListEvent) =>
         setIsMobile(event.matches)
      const mediaQueryList = window.matchMedia(
         `(max-width: ${MOBILE_BREAKPOINT}px)`,
      )
      checkDevice(mediaQueryList)
      mediaQueryList.addEventListener("change", checkDevice)
      return () => {
         mediaQueryList.removeEventListener("change", checkDevice)
      }
   }, [])

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
