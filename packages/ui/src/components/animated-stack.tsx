import * as React from "react"
import { cn } from "../utils"

export function AnimatedStack({
   children,
   activeIndex,
}: {
   activeIndex: number
   children: React.ReactNode
}) {
   const [exitingIndex, setExitingIndex] = React.useState<number | null>(null)

   React.useEffect(() => {
      if (activeIndex !== null) setExitingIndex(activeIndex)
   }, [activeIndex])

   return (
      <>
         {React.Children.map(children, (child, index) => {
            const isActive = index === activeIndex
            const isExiting = index === exitingIndex

            return (
               <div
                  aria-hidden={!isActive}
                  data-active={isActive}
                  data-starting-style={isActive ? "" : undefined}
                  data-ending-style={isExiting ? "" : undefined}
                  className={cn(
                     "transition-all duration-[250ms] ease-(--vaul)",
                     index === 0 ? "" : "absolute inset-0",
                     "data-[active=false]:pointer-events-none data-[active=false]:z-0 data-[active=false]:scale-90",
                     "data-[starting-style]:z-10 data-[starting-style]:translate-y-0 data-[starting-style]:scale-100 data-[starting-style]:opacity-100",
                     "data-[ending-style]:z-0",
                     index === 0
                        ? "data-[ending-style]:opacity-50"
                        : "data-[ending-style]:opacity-0",
                     index === 0
                        ? "-translate-y-8 opacity-50"
                        : "translate-y-9 opacity-0",
                  )}
                  onTransitionEnd={() => {
                     if (index === exitingIndex) setExitingIndex(null)
                  }}
               >
                  {child}
               </div>
            )
         })}
      </>
   )
}
