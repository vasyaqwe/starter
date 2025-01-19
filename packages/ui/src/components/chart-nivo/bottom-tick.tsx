import type { AxisTickProps } from "@nivo/axes"
import { cn } from "../../utils"
import { useChart } from "./context"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function BottomTick({ x, y, value, textAnchor }: AxisTickProps<any>) {
   return (
      <g transform={`translate(${x}, ${y})`}>
         <text
            textAnchor={textAnchor}
            style={{
               fill: "var(--color-primary-10)",
               fontWeight: 700,
               fontFamily: "inherit",
               transform: "translateY(2rem)",
               fontSize: 12,
            }}
         >
            {value}
         </text>
      </g>
   )
}

export function BottomLine({
   className,
   margin,
   ...props
}: React.ComponentProps<"line"> & {
   margin: { top: number; right: number; bottom: number; left: number }
}) {
   const { height, width } = useChart()

   return (
      <line
         y1={height - margin.top + 10}
         y2={height - margin.top + 10}
         x2={margin.left + width}
         className={cn("stroke-primary-7", className)}
         strokeWidth={2}
         {...props}
      />
   )
}
