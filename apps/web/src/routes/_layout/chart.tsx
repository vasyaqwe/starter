import { Card } from "@project/ui/components/card"
import { Bar } from "@project/ui/components/chart-nivo/bar"
import {
   CrosshairLine,
   CrosshairTooltip,
} from "@project/ui/components/chart-nivo/crosshair"
import { Line } from "@project/ui/components/chart-nivo/line"
import { ScrollArea } from "@project/ui/components/scroll-area"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/chart")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <ScrollArea className={"min-w-0 p-4 md:p-6"}>
         <Card className=" flex w-full max-w-fit flex-wrap gap-4 overflow-x-auto p-6">
            <Bar
               height={300}
               width={500}
               data={[
                  { country: "USA", value: 120 },
                  { country: "UK", value: 90 },
                  { country: "Canada", value: 75 },
                  { country: "Germany", value: 110 },
               ]}
               colors={(_bar) => "var(--color-accent)"}
               keys={["value"]}
               indexBy="country"
            >
               <CrosshairTooltip>
                  {(data) => <div>{data.data.country}</div>}
               </CrosshairTooltip>
               <CrosshairLine />
            </Bar>
         </Card>
         <Card className="flex w-full max-w-fit flex-wrap gap-4 overflow-x-auto p-6">
            <Line
               height={300}
               width={500}
               data={[
                  {
                     id: "stock-1",
                     data: [
                        { x: "Day 1", y: 100.0 },
                        { x: "Day 2", y: 101.25 },
                        { x: "Day 3", y: 102.5 },
                        { x: "Day 4", y: 103.0 },
                        { x: "Day 5", y: 101.75 },
                        { x: "Day 6", y: 100.5 },
                        { x: "Day 7", y: 101.0 },
                        { x: "Day 8", y: 112.25 },
                        { x: "Day 9", y: 103.5 },
                        { x: "Day 10", y: 104.0 },
                        { x: "Day 11", y: 104.5 },
                        { x: "Day 12", y: 105.0 },
                        { x: "Day 13", y: 103.75 },
                        { x: "Day 14", y: 102.5 },
                        { x: "Day 15", y: 103.0 },
                        { x: "Day 16", y: 103.5 },
                        { x: "Day 17", y: 104.0 },
                        { x: "Day 18", y: 104.5 },
                        { x: "Day 19", y: 105.0 },
                        { x: "Day 20", y: 154.0 },
                        { x: "Day 21", y: 105.5 },
                        { x: "Day 22", y: 106.0 },
                        { x: "Day 23", y: 106.5 },
                        { x: "Day 24", y: 155.25 },
                        { x: "Day 25", y: 154.0 },
                        { x: "Day 26", y: 154.5 },
                        { x: "Day 27", y: 155.0 },
                        { x: "Day 28", y: 155.5 },
                        { x: "Day 29", y: 156.0 },
                        { x: "Day 30", y: 156.5 },
                        { x: "Day q", y: 100.0 },
                        { x: "Day w", y: 101.25 },
                        { x: "Day e", y: 102.5 },
                        { x: "Day r", y: 103.0 },
                        { x: "Day t", y: 101.75 },
                        { x: "Day y", y: 100.5 },
                        { x: "Day u", y: 101.0 },
                        { x: "Day i", y: 112.25 },
                        { x: "Day o", y: 103.5 },
                        { x: "Day p", y: 104.0 },
                        { x: "Day a", y: 104.5 },
                        { x: "Day s", y: 105.0 },
                        { x: "Day d", y: 103.75 },
                        { x: "Day f", y: 102.5 },
                        { x: "Day g", y: 103.0 },
                        { x: "Day h", y: 103.5 },
                        { x: "Day j", y: 104.0 },
                        { x: "Day k", y: 104.5 },
                        { x: "Day l", y: 105.0 },
                        { x: "Day z", y: 154.0 },
                        { x: "Day x", y: 105.5 },
                        { x: "Day c", y: 106.0 },
                        { x: "Day v", y: 106.5 },
                        { x: "Day b", y: 155.25 },
                        { x: "Day n", y: 154.0 },
                        { x: "Day m", y: 154.5 },
                        { x: "Day 123123", y: 155.0 },
                        { x: "Day 321321", y: 155.5 },
                        { x: "Day dsadsa", y: 156.0 },
                        { x: "Day 2135", y: 100 },
                     ],
                  },
               ]}
               colors={(_bar) => "var(--color-accent)"}
            >
               <CrosshairTooltip>
                  {(data) => <div>{JSON.stringify(data)}</div>}
               </CrosshairTooltip>
               <CrosshairLine />
            </Line>
         </Card>
      </ScrollArea>
   )
}
