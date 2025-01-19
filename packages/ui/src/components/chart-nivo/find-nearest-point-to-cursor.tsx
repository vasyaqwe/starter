import * as React from "react"
import { useChart } from "./context"
import type { Point } from "./types"

export function FindNearestPointToCursor({
   points,
   margin,
   xScale,
}: {
   points: Point[]
   margin: { top: number; right: number; bottom: number; left: number }
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   xScale: any
}) {
   const layerRef = React.useRef<SVGRectElement>(null)
   const padding = 16

   const { width, height, setPoint } = useChart()

   const onPointerMove = (event: React.PointerEvent<SVGRectElement>) => {
      const layerRect = layerRef.current?.getBoundingClientRect()
      if (!layerRect) return

      const barWidth = xScale.bandwidth()
      const type = xScale.type as "point" | "band"
      const _step = xScale.step()
      const _range = xScale.range()[1]

      const xOffset =
         type === "point"
            ? event.clientX - layerRect.x + margin.left
            : event.clientX - layerRect.x - margin.left - padding / 2

      const closestPoint = (prev: Point, curr: Point) =>
         Math.abs((curr?.x ?? 0) - xOffset) <=
         Math.abs((prev?.x ?? 0) - xOffset)
            ? curr
            : prev
      const point = points.reduce(closestPoint, points?.[0] as Point)

      if (!point) return

      setPoint({
         ...point,
         x: type === "band" ? point.x + margin.left + barWidth / 2 : point.x,
      })
   }

   return (
      <g transform={`translate(-${padding / 2},0)`}>
         <rect
            ref={layerRef}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setPoint(null)}
            width={width + padding}
            height={height}
            fillOpacity={0}
         />
      </g>
   )
}
