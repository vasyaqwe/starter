import type { AxisTickProps } from "@nivo/axes"

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
