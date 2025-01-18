import { type BarDatum, Bar as BarPrimitive, type BarSvgProps } from "@nivo/bar"
import { BarItem } from "./bar-item"
import { BottomTick } from "./bottom-tick"
import { chartTheme } from "./constants"
import { FindNearestPointToCursor } from "./find-nearest-point-to-cursor"

type BarProps<T extends BarDatum> = Omit<BarSvgProps<T>, "data"> & {
   data: T[]
}

export function Bar<T extends BarDatum>({ width, ...props }: BarProps<T>) {
   return (
      <BarPrimitive
         width={width}
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
               <FindNearestPointToCursor
                  {...props}
                  scale={props.xScale}
                  points={props.bars.map((bar) => ({
                     x: bar.x,
                     y: bar.y,
                     data: { x: bar.x, y: bar.y, ...bar.data },
                  }))}
                  chartWidth={width}
                  margin={props.margin}
               />
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
   )
}
