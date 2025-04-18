import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { ValueType } from "recharts/types/component/DefaultTooltipContent"
import { cn } from "../utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
   [k in string]: {
      label?: React.ReactNode
      icon?: React.ComponentType
   } & (
      | { color?: string; theme?: never }
      | { color?: never; theme: Record<keyof typeof THEMES, string> }
   )
}

type ChartContextProps = {
   config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
   const context = React.useContext(ChartContext)

   if (!context)
      throw new Error("useChart must be used within a <ChartContainer />")

   return context
}

interface ChartContainerProps extends React.ComponentProps<"div"> {
   config: ChartConfig
   children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
   >["children"]
}

function ChartContainer({
   id,
   className,
   children,
   config,
   ...props
}: ChartContainerProps) {
   const uniqueId = React.useId()
   const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

   return (
      <ChartContext.Provider value={{ config }}>
         <div
            data-chart={chartId}
            className={cn(
               "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-line]:stroke-neutral [&_.recharts-cartesian-axis-tick-line]:stroke-neutral [&_.recharts-cartesian-axis-tick_text]:fill-foreground/80 [&_.recharts-cartesian-grid_line]:stroke-neutral [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid]:stroke-neutral [&_.recharts-radial-bar-background-sector]:fill-neutral [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral [&_.recharts-reference-line]:stroke-neutral [&_.recharts-sector]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
               className,
            )}
            {...props}
         >
            <ChartStyle
               id={chartId}
               config={config}
            />
            <RechartsPrimitive.ResponsiveContainer>
               {children}
            </RechartsPrimitive.ResponsiveContainer>
         </div>
      </ChartContext.Provider>
   )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
   const colorConfig = Object.entries(config).filter(
      ([, config]) => config.theme || config.color,
   )

   if (!colorConfig.length) {
      return null
   }

   return (
      <style
         dangerouslySetInnerHTML={{
            __html: Object.entries(THEMES)
               .map(
                  ([theme, prefix]) => `
                     ${prefix} [data-chart=${id}] {
                     ${colorConfig
                        .map(([key, itemConfig]) => {
                           const color =
                              itemConfig.theme?.[
                                 theme as keyof typeof itemConfig.theme
                              ] || itemConfig.color
                           return color ? `  --color-${key}: ${color};` : null
                        })
                        .join("\n")}
                     }
                  `,
               )
               .join("\n"),
         }}
      />
   )
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ChartTooltipCursor({ points, height }: any) {
   return (
      <>
         <defs>
            <linearGradient
               id="gradientCursor"
               x1="0"
               y1="0"
               x2="0"
               y2="1"
            >
               <stop
                  offset="0%"
                  stopColor="var(--color-foreground)"
                  stopOpacity="0"
               />
               <stop
                  offset="25%"
                  stopColor="var(--color-foreground)"
                  stopOpacity="0.9"
               />
               <stop
                  offset="75%"
                  stopColor="var(--color-foreground)"
                  stopOpacity="0.9"
               />
               <stop
                  offset="100%"
                  stopColor="var(--color-foreground)"
                  stopOpacity="0"
               />
            </linearGradient>
         </defs>
         <RechartsPrimitive.Rectangle
            x={points[0].x}
            y={0}
            width={2}
            height={height}
            fill="url(#gradientCursor)"
            className="relative z-[5000]"
            style={{ pointerEvents: "all" }}
         />
      </>
   )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps
   extends React.ComponentProps<typeof RechartsPrimitive.Tooltip> {
   hideLabel?: boolean
   hideIndicator?: boolean
   indicator?: "line" | "dot" | "dashed"
   nameKey?: string
   labelKey?: string
   valueFormatter?: (value: ValueType) => string
   className?: string
   color?: string
}

function ChartTooltipContent({
   active,
   payload,
   className,
   indicator = "dot",
   hideLabel = false,
   hideIndicator = false,
   label,
   labelFormatter,
   labelClassName,
   formatter,
   color,
   nameKey,
   labelKey,
   valueFormatter,
}: ChartTooltipContentProps) {
   const { config } = useChart()

   const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
         return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
         !labelKey && typeof label === "string"
            ? config[label as keyof typeof config]?.label || label
            : itemConfig?.label

      if (labelFormatter) {
         return (
            <div className={cn("font-medium", labelClassName)}>
               {labelFormatter(value, payload)}
            </div>
         )
      }

      if (!value) return null

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
   }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
   ])

   if (!active || !payload?.length) return null

   const nestLabel = payload.length === 1 && indicator !== "dot"

   return (
      <div
         className={cn(
            "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-neutral bg-background px-2.5 py-1.5 text-sm shadow-xl",
            className,
         )}
      >
         {!nestLabel ? tooltipLabel : null}
         <div className="grid gap-1.5">
            {payload.map((item, index) => {
               const key = `${nameKey || item.name || item.dataKey || "value"}`
               const itemConfig = getPayloadConfigFromPayload(config, item, key)
               const indicatorColor = color || item.payload.fill || item.color

               return (
                  <div
                     key={item.dataKey}
                     className={cn(
                        "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-foreground/75",
                        indicator === "dot" && "items-center",
                     )}
                  >
                     {formatter && item?.value !== undefined && item.name ? (
                        formatter(
                           item.value,
                           item.name,
                           item,
                           index,
                           item.payload,
                        )
                     ) : (
                        <>
                           {itemConfig?.icon ? (
                              <itemConfig.icon />
                           ) : (
                              !hideIndicator && (
                                 <div
                                    className={cn(
                                       "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                                       {
                                          "size-3": indicator === "dot",
                                          "w-1": indicator === "line",
                                          "w-0 border-[1.5px] border-dashed bg-transparent":
                                             indicator === "dashed",
                                          "my-0.5":
                                             nestLabel &&
                                             indicator === "dashed",
                                       },
                                    )}
                                    style={
                                       {
                                          "--color-bg": indicatorColor,
                                          "--color-border": indicatorColor,
                                       } as React.CSSProperties
                                    }
                                 />
                              )
                           )}
                           <div
                              className={cn(
                                 "flex grow justify-between gap-2 leading-none",
                                 nestLabel ? "items-end" : "items-center",
                              )}
                           >
                              <div className="grid gap-1.5">
                                 {nestLabel ? tooltipLabel : null}
                                 <span className="mb-0.5 text-foreground/75 leading-none">
                                    {itemConfig?.label?.toString() ?? item.name}
                                 </span>
                              </div>
                              {item.value && (
                                 <span
                                    className={cn(
                                       "block font-mono font-semibold text-foreground tabular-nums",
                                       nestLabel ? "mb-px" : "",
                                    )}
                                 >
                                    {valueFormatter
                                       ? valueFormatter(item.value)
                                       : item.value.toLocaleString()}
                                 </span>
                              )}
                           </div>
                        </>
                     )}
                  </div>
               )
            })}
         </div>
      </div>
   )
}

const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps
   extends React.ComponentProps<"div">,
      Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> {
   hideIcon?: boolean
   nameKey?: string
}

function ChartLegendContent({
   className,
   hideIcon = false,
   payload,
   verticalAlign = "bottom",
   nameKey,
}: ChartLegendContentProps) {
   const { config } = useChart()

   if (!payload?.length) {
      return null
   }

   return (
      <div
         className={cn(
            "flex items-center justify-center gap-4",
            verticalAlign === "top" ? "pb-3" : "pt-3",
            className,
         )}
      >
         {payload.map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
               <div
                  key={item.value}
                  className={cn(
                     "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-foreground/75",
                  )}
               >
                  {itemConfig?.icon && !hideIcon ? (
                     <itemConfig.icon />
                  ) : (
                     <div
                        className="h-2 w-2 shrink-0 rounded-[2px]"
                        style={{
                           backgroundColor: item.color,
                        }}
                     />
                  )}
                  {itemConfig?.label}
               </div>
            )
         })}
      </div>
   )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
   config: ChartConfig,
   payload: unknown,
   key: string,
) {
   if (typeof payload !== "object" || payload === null) return undefined

   const payloadPayload =
      "payload" in payload &&
      typeof payload.payload === "object" &&
      payload.payload !== null
         ? payload.payload
         : undefined

   let configLabelKey: string = key

   if (
      key in payload &&
      typeof payload[key as keyof typeof payload] === "string"
   ) {
      configLabelKey = payload[key as keyof typeof payload] as string
   } else if (
      payloadPayload &&
      key in payloadPayload &&
      typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
   ) {
      configLabelKey = payloadPayload[
         key as keyof typeof payloadPayload
      ] as string
   }

   return configLabelKey in config
      ? config[configLabelKey]
      : config[key as keyof typeof config]
}

export {
   ChartContainer,
   ChartTooltip,
   ChartTooltipCursor,
   ChartTooltipContent,
   ChartLegend,
   ChartLegendContent,
   ChartStyle,
}
