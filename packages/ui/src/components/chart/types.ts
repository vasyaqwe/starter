import type { BarDatum, ComputedDatum } from "@nivo/bar"

export type Point<T extends BarDatum = BarDatum> = {
   x: number
   y: number
   data: ComputedDatum<T>
}
