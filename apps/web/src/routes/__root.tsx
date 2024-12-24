import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   createRootRouteWithContext,
   useMatches,
} from "@tanstack/react-router"
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

   return (
      <Meta>
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
