import { Card } from "@project/ui/components/card"
import { Bar } from "@project/ui/components/chart/bar"
import { Crosshair } from "@project/ui/components/chart/crosshair"
import { ChartContainer } from "@project/ui/components/chart/index"
import { Line } from "@project/ui/components/chart/line"
import { ScrollArea } from "@project/ui/components/scroll-area"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/chart")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <ScrollArea className={"min-w-0 p-4 md:p-6"}>
         <Card className=" flex w-full max-w-fit flex-wrap gap-4 overflow-x-auto p-6">
            <ChartContainer>
               <Crosshair />
               <Bar
                  height={300}
                  width={500}
                  data={[
                     { country: "USA", value: 120 },
                     { country: "UK", value: 90 },
                     { country: "Canada", value: 75 },
                     { country: "Germany", value: 110 },
                     // { country: "1", value: 110 },
                     // { country: "2", value: 110 },
                     // { country: "3", value: 110 },
                     // { country: "4", value: 110 },
                     // { country: "5", value: 110 },
                     // { country: "6", value: 110 },
                  ]}
                  colors={(_bar) => "var(--color-accent)"}
                  keys={["value"]}
                  indexBy="country"
               />
            </ChartContainer>
         </Card>
         <Card className="flex w-full max-w-fit flex-wrap gap-4 overflow-x-auto p-6">
            <ChartContainer>
               <Crosshair />
               <Line
                  height={300}
                  width={500}
                  data={[
                     {
                        id: "japan",
                        data: [
                           {
                              x: "plane",
                              y: 286,
                           },
                           {
                              x: "helicopter",
                              y: 186,
                           },
                           {
                              x: "boat",
                              y: 59,
                           },
                           {
                              x: "train",
                              y: 274,
                           },
                           {
                              x: "subway",
                              y: 253,
                           },
                        ],
                     },
                  ]}
                  colors={(_bar) => "var(--color-accent)"}
               />
            </ChartContainer>
         </Card>
      </ScrollArea>
   )
}
