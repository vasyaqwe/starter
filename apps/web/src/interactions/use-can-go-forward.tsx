import { useUIStore } from "@project/ui/store"
import { useRouterState } from "@tanstack/react-router"

export function useCanGoForward() {
   const historyLength = useUIStore().historyLength

   const currentIndex = useRouterState({
      select: (s) => s.location.state.__TSR_index,
   })

   return currentIndex < historyLength - 1
}
