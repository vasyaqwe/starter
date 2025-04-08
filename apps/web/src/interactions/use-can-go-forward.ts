import { historyLengthAtom } from "@project/ui/store"
import { useRouterState } from "@tanstack/react-router"
import { useAtomValue } from "jotai"

export function useCanGoForward() {
   const historyLength = useAtomValue(historyLengthAtom)

   const currentIndex = useRouterState({
      select: (s) => s.location.state.__TSR_index,
   })

   return currentIndex < historyLength - 1
}
