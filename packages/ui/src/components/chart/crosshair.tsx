import * as React from "react"
import { popupStyles, tooltipStyles } from "../../constants"
import { cn } from "../../utils"
import { useChart } from "./context"
import type { Point } from "./types"

export function CrosshairTooltip({
   className,
   children,
   ...props
}: {
   children: React.ReactNode | ((data: Point["data"]) => React.ReactNode)
} & Omit<React.ComponentProps<"div">, "children">) {
   const ref = React.useRef<HTMLDivElement>(null)
   const [width, setWidth] = React.useState(0)

   const { point } = useChart()

   React.useLayoutEffect(() => {
      if (!ref.current) return
      setWidth(ref.current.getBoundingClientRect().width)
   }, [ref, point?.data])

   if (!point?.data) return null

   return (
      <div
         ref={ref}
         className={cn(
            popupStyles.base,
            tooltipStyles.base,
            `pointer-events-none absolute z-[6] flex items-center gap-1`,
            className,
         )}
         style={{
            left: `${point.x - width / 2}px`,
         }}
         {...props}
      >
         {typeof children === "function" ? children(point.data) : children}
      </div>
   )
}

export function CrosshairLine({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const { point } = useChart()
   if (!point?.data) return null

   return (
      <div
         className={cn(
            "-translate-y-1/2 pointer-events-none absolute top-[calc(50%-0.75rem)] z-[5] h-[85%] w-[2px] bg-[linear-gradient(to_bottom,transparent,var(--color-white),transparent)]",
            className,
         )}
         style={{ left: `${point.x}px` }}
         {...props}
      />
   )
}
