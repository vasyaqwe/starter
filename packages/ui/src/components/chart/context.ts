import * as React from "react"
import type { Point } from "./types"

type ChartContextValue = {
   width: number
   height: number
   point: Point | null
   setPoint: (point: Point | null) => void
}

export const ChartContext = React.createContext<ChartContextValue | null>(null)

export function useChart() {
   const context = React.useContext(ChartContext)
   if (!context) throw new Error("useChart must be used within ChartProvider")
   return context
}
