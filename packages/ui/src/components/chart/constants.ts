import type { Theme } from "@nivo/core"

export const chartTheme = {
   axis: {
      domain: {
         line: {
            stroke: "none",
         },
      },
      ticks: {
         line: {
            stroke: "none",
         },
         text: {
            fill: "var(--color-primary-10)",
            fontWeight: 700,
            fontFamily: "inherit",
         },
      },
   },
   grid: {
      line: {
         strokeDasharray: "4 4",
         stroke: "var(--color-primary-7)",
      },
   },
} satisfies Theme
