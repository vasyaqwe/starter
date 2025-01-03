import * as React from "react"
import { cn } from "../utils"

export function TransitionHeight({
   children,
   className,
   render: Component = "div",
   ...props
}: React.ComponentProps<"div"> & { render?: React.ElementType }) {
   const containerRef = React.useRef<HTMLDivElement | null>(null)
   const [height, setHeight] = React.useState<number | "auto">("auto")

   React.useEffect(() => {
      const element = containerRef.current
      if (!element) return

      const resizeObserver = new ResizeObserver(() => {
         const newHeight = element.scrollHeight

         // Get padding-block values from the computed styles
         const parentElement = element.parentElement
         if (parentElement) {
            const computedStyle = window.getComputedStyle(parentElement)
            const paddingBlockStart = parseFloat(computedStyle.paddingTop) || 0
            const paddingBlockEnd = parseFloat(computedStyle.paddingBottom) || 0

            // Include padding in height calculation
            setHeight(newHeight + paddingBlockStart + paddingBlockEnd)
         } else {
            setHeight(newHeight) // Fallback to just scrollHeight
         }
      })

      resizeObserver.observe(element)

      return () => resizeObserver.disconnect()
   }, [children])

   return (
      <Component
         className={cn(
            "overflow-hidden transition-[height] duration-500 ease-(--ease-vaul)",
            className,
         )}
         style={{ height }}
         {...props}
      >
         <div ref={containerRef}>{children}</div>
      </Component>
   )
}
