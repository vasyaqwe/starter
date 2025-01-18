import type { Dimensions } from "@nivo/core"
import {
   Line as LinePrimitive,
   type LineSvgProps,
   type Serie,
} from "@nivo/line"
import { BottomTick } from "./bottom-tick"
import { chartTheme } from "./constants"
import { FindNearestPointToCursor } from "./find-nearest-point-to-cursor"

type LineProps<T extends Serie> = Omit<LineSvgProps & Dimensions, "data"> & {
   data: T[]
}

export function Line<T extends Serie>({ width, ...props }: LineProps<T>) {
   return (
      <LinePrimitive
         width={width}
         theme={chartTheme}
         gridYValues={Array.from({ length: 5 }, (_, i) => i * 70)}
         axisLeft={{
            tickValues: Array.from({ length: 5 }, (_, i) => i * 70),
         }}
         layers={[
            "grid",
            "axes",
            "lines",
            "points",
            "slices",
            "markers",
            (props) => (
               <FindNearestPointToCursor
                  {...props}
                  scale={props.xScale}
                  points={props.points as never}
                  chartWidth={width}
                  margin={props.margin as never}
               />
            ),
         ]}
         margin={{ top: 10, right: 10, bottom: 35, left: 35 }}
         axisBottom={{
            renderTick: BottomTick,
         }}
         animate={false}
         {...props}
      />
   )
}
