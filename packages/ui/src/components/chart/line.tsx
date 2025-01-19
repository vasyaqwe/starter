import type { Dimensions } from "@nivo/core"
import {
   Line as LinePrimitive,
   type LineSvgProps,
   type Serie,
} from "@nivo/line"
import * as React from "react"
import { ChartContainer } from "."
import { BottomLine } from "./bottom-tick"
import { chartTheme } from "./constants"
import { ChartContext } from "./context"
import { FindNearestPointToCursor } from "./find-nearest-point-to-cursor"
import type { Point } from "./types"

type LineProps<T extends Serie> = Omit<LineSvgProps & Dimensions, "data"> & {
   data: T[]
} & { children: React.ReactNode }

export function Line<T extends Serie>({
   width,
   height,
   children,
   data,
   ...props
}: LineProps<T>) {
   const [point, setPoint] = React.useState<Point | null>(null)

   return (
      <ChartContainer>
         <ChartContext.Provider value={{ width, height, point, setPoint }}>
            {children}
            <LinePrimitive
               data={data}
               width={width}
               height={height}
               theme={chartTheme}
               // gridYValues={Array.from({ length: 5 }, (_, i) => i * 70)}
               // axisLeft={{
               //    tickValues: Array.from({ length: 5 }, (_, i) => i * 70),
               // }}
               layers={[
                  "lines",
                  "points",
                  "slices",
                  "markers",
                  (props) => (
                     <>
                        <FindNearestPointToCursor
                           {...props}
                           xScale={props.xScale}
                           points={props.points as never}
                           margin={props.margin as never}
                        />
                        <BottomLine
                           margin={props.margin as never}
                           className="stroke-primary-5"
                        />
                     </>
                  ),
               ]}
               margin={{ top: 10, right: 10, bottom: 35, left: 35 }}
               // axisBottom={{
               //    renderTick: BottomTick,
               // }}
               animate={false}
               {...props}
            />
         </ChartContext.Provider>
      </ChartContainer>
   )
}
