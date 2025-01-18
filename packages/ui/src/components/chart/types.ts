import type { BarDatum, ComputedDatum } from "@nivo/bar"

export type Point = {
   x: number
   y: number
   data: ComputedDatum<BarDatum>
} | null
