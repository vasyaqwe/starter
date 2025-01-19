import { type BarDatum, Bar as BarPrimitive, type BarSvgProps } from "@nivo/bar"
import * as React from "react"
import { ChartContainer } from "."
import { BarItem } from "./bar-item"
import { BottomLine, BottomTick } from "./bottom-tick"
import { chartTheme } from "./constants"
import { ChartContext } from "./context"
import { FindNearestPointToCursor } from "./find-nearest-point-to-cursor"
import type { Point } from "./types"

type BarProps<T extends BarDatum> = Omit<BarSvgProps<T>, "data"> & {
   data: T[]
} & { children: React.ReactNode }

export function Bar<T extends BarDatum>({
   width,
   height,
   children,
   ...props
}: BarProps<T>) {
   const [point, setPoint] = React.useState<Point | null>(null)

   return (
      <ChartContainer>
         <ChartContext.Provider value={{ width, height, point, setPoint }}>
            {children}
            <BarPrimitive
               width={width}
               height={height}
               theme={chartTheme}
               gridYValues={Array.from({ length: 5 }, (_, i) => i * 25)}
               axisLeft={{
                  tickValues: Array.from({ length: 5 }, (_, i) => i * 25),
               }}
               layers={[
                  "grid",
                  "axes",
                  "bars",
                  "markers",
                  (props) => (
                     <>
                        <FindNearestPointToCursor
                           {...props}
                           points={props.bars.map((bar) => ({
                              x: bar.x,
                              y: bar.y,
                              data: { x: bar.x, y: bar.y, ...bar.data },
                           }))}
                           margin={props.margin}
                        />
                        <BottomLine margin={props.margin as never} />
                     </>
                  ),
               ]}
               margin={{ top: 10, right: 10, bottom: 35, left: 30 }}
               padding={0.3}
               valueScale={{ type: "linear" }}
               axisBottom={{
                  renderTick: BottomTick,
               }}
               animate={false}
               barComponent={BarItem}
               borderRadius={10}
               {...props}
            />
         </ChartContext.Provider>
      </ChartContainer>
   )
}
