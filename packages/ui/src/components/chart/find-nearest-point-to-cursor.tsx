import { useSetAtom } from "jotai"
import * as React from "react"
import { pointAtom } from "./store"
import type { Point } from "./types"

export function FindNearestPointToCursor({
   points,
   innerHeight,
   chartWidth,
   margin,
   scale,
}: {
   points: Point[]
   innerHeight: number
   chartWidth: number
   margin: { top: number; right: number; bottom: number; left: number }
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   scale: any
}) {
   const layerRef = React.useRef<SVGRectElement>(null)
   const padding = 16

   const setPoint = useSetAtom(pointAtom)

   const onPointerMove = (event: React.PointerEvent<SVGRectElement>) => {
      const layerRect = layerRef.current?.getBoundingClientRect()
      if (!layerRect) return
      const xOffset = event.clientX - layerRect.x - margin.left - padding / 2

      const closestPoint = (prev: Point, curr: Point) =>
         Math.abs((curr?.x ?? 0) - xOffset) <=
         Math.abs((prev?.x ?? 0) - xOffset)
            ? curr
            : prev
      const point = points.reduce(closestPoint, points?.[0] as Point)

      const barWidth = scale.bandwidth()
      if (!point) return

      setPoint({
         ...point,
         x: point.x + margin.left + barWidth / 2,
      })
   }

   return (
      <>
         <line
            y1={innerHeight - margin.top + 10}
            y2={innerHeight - margin.top + 10}
            x2={margin.left + innerWidth}
            className="stroke-primary-7"
            strokeWidth={2}
         />
         <g transform={`translate(-${padding / 2},0)`}>
            <rect
               ref={layerRef}
               onPointerMove={onPointerMove}
               onPointerLeave={() => setPoint(null)}
               width={chartWidth + padding}
               height={innerHeight}
               fillOpacity={0}
            />
         </g>
      </>
   )
}
