import type { BarDatum, BarItemProps } from "@nivo/bar"
import { useTooltip } from "@nivo/tooltip"
import { animated, to } from "@react-spring/web"
import * as React from "react"

export const BarItem = <RawDatum extends BarDatum>({
   bar: { data, ...bar },
   style: { borderColor, color, height, transform, width },
   borderRadius,
   borderWidth,
   label,
   isInteractive,
   onClick,
   onMouseEnter,
   onMouseLeave,
   tooltip,
   isFocusable,
   ariaLabel,
   ariaLabelledBy,
   ariaDescribedBy,
}: BarItemProps<RawDatum>) => {
   const { showTooltipFromEvent, showTooltipAt, hideTooltip } = useTooltip()
   const renderTooltip = React.useMemo(
      () => () => React.createElement(tooltip, { ...bar, ...data }),
      [tooltip, bar, data],
   )

   const handleClick = React.useCallback(
      (event: React.MouseEvent<SVGRectElement>) => {
         onClick?.({ color: bar.color, ...data }, event)
      },
      [bar, data, onClick],
   )
   const handleTooltip = React.useCallback(
      (event: React.MouseEvent<SVGRectElement>) =>
         showTooltipFromEvent(renderTooltip(), event),
      [showTooltipFromEvent, renderTooltip],
   )
   const handleMouseEnter = React.useCallback(
      (event: React.MouseEvent<SVGRectElement>) => {
         onMouseEnter?.(data, event)
         showTooltipFromEvent(renderTooltip(), event)
      },
      [data, onMouseEnter, showTooltipFromEvent, renderTooltip],
   )
   const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<SVGRectElement>) => {
         onMouseLeave?.(data, event)
         hideTooltip()
      },
      [data, hideTooltip, onMouseLeave],
   )

   // extra handlers to allow keyboard navigation
   const handleFocus = React.useCallback(() => {
      showTooltipAt(renderTooltip(), [bar.absX + bar.width / 2, bar.absY])
   }, [showTooltipAt, renderTooltip, bar])
   const handleBlur = React.useCallback(() => {
      hideTooltip()
   }, [hideTooltip])

   return (
      // @ts-ignore
      <animated.g transform={transform}>
         <defs>
            <clipPath id={`round-corner-${label}`}>
               {/* @ts-ignore */}
               <animated.rect
                  x="0"
                  y="0"
                  rx={borderRadius}
                  ry={borderRadius}
                  width={to(width, (value) => Math.max(value as never, 0))}
                  height={to(height, (value) =>
                     Math.max((value as never) + borderRadius, 0),
                  )}
               />
            </clipPath>
         </defs>

         {/* @ts-ignore */}
         <animated.rect
            clipPath={`url(#round-corner-${label})`}
            width={to(width, (value) => Math.max(value as never, 0))}
            height={to(height, (value) => Math.max(value as never, 0))}
            fill={data.fill ?? color}
            strokeWidth={borderWidth}
            stroke={borderColor}
            focusable={isFocusable}
            tabIndex={isFocusable ? 0 : undefined}
            aria-label={ariaLabel ? ariaLabel(data) : undefined}
            aria-labelledby={ariaLabelledBy ? ariaLabelledBy(data) : undefined}
            aria-describedby={
               ariaDescribedBy ? ariaDescribedBy(data) : undefined
            }
            onMouseEnter={isInteractive ? handleMouseEnter : undefined}
            onMouseMove={isInteractive ? handleTooltip : undefined}
            onMouseLeave={isInteractive ? handleMouseLeave : undefined}
            onClick={isInteractive ? handleClick : undefined}
            onFocus={isInteractive && isFocusable ? handleFocus : undefined}
            onBlur={isInteractive && isFocusable ? handleBlur : undefined}
         />
      </animated.g>
   )
}
