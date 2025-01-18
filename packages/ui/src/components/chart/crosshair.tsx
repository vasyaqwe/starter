import { useAtomValue } from "jotai"
import * as React from "react"
import { popupStyles, tooltipStyles } from "../../constants"
import { cn } from "../../utils"
import { pointAtom } from "./store"

export function Crosshair() {
   const tooltipRef = React.useRef<HTMLDivElement>(null)
   const [tooltipWidth, setTooltipWidth] = React.useState(0)

   const point = useAtomValue(pointAtom)

   React.useLayoutEffect(() => {
      if (!tooltipRef.current) return
      setTooltipWidth(tooltipRef.current.getBoundingClientRect().width)
   }, [tooltipRef, point?.data])

   if (!point?.data) return null

   return (
      <>
         <div
            ref={tooltipRef}
            className={cn(
               popupStyles.base,
               tooltipStyles.base,
               `pointer-events-none absolute z-[6] flex items-center gap-1`,
            )}
            style={{
               left: `${point.x - tooltipWidth / 2}px`,
            }}
         >
            <span> {point.data.value} </span>
            <span className="-mt-px text-white/70">•</span>
            {/* <span className="text-white/70">{point.data.data.country}</span> */}
         </div>
         <div
            className="-translate-y-1/2 pointer-events-none absolute top-[calc(50%-0.75rem)] z-[5] h-[85%] w-[2px] bg-[linear-gradient(to_bottom,transparent,var(--color-white),transparent)]"
            style={{ left: `${point.x}px` }}
         />
      </>
   )
}
