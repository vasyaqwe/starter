import * as React from "react"
import { cn } from "../utils"

export function AnimatedStack({
   children,
   activeIndex,
}: {
   activeIndex: number
   children: React.ReactNode
}) {
   return (
      <>
         {React.Children.map(children, (child, index) => {
            const isActive = index === activeIndex
            return (
               <div
                  aria-hidden={!isActive}
                  data-active={isActive}
                  className={cn(
                     "pointer-events-none z-0 scale-[91%]",
                     index === 0
                        ? "-translate-y-8 opacity-70"
                        : "absolute inset-0 translate-y-9 opacity-0",
                     "transition-all duration-[250ms] ease-(--vaul)",
                     "data-[active=true]:pointer-events-auto data-[active=true]:z-10 data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100",
                  )}
               >
                  {child}
               </div>
            )
         })}
      </>
   )
}
