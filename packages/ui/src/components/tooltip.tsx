import { Tooltip as TooltipPrimitive } from "@base-ui-components/react/tooltip"
import { popupStyles } from "../constants"
import { cn } from "../utils"

export function Tooltip({
   delay = 450,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
   return (
      <TooltipPrimitive.Root
         delay={delay}
         {...props}
      />
   )
}

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipPortal = TooltipPrimitive.Portal
export const TooltipPositioner = TooltipPrimitive.Positioner
export const TooltipArrow = TooltipPrimitive.Arrow

export function TooltipPopup({
   className,
   children,
   sideOffset = 7,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Positioner>) {
   return (
      <TooltipPortal>
         <TooltipPositioner
            sideOffset={sideOffset}
            {...props}
         >
            <TooltipPrimitive.Popup
               className={cn(
                  popupStyles.base,
                  popupStyles.transition,
                  "flex items-center gap-1 rounded-[9px] px-2 py-[3px] text-sm",
                  className,
               )}
            >
               {/* <TooltipArrow
                  className={
                     "data-[side=right]:-rotate-90 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=top]:rotate-180 dark:data-[side=bottom]:top-[-9px] dark:data-[side=top]:bottom-[-9px]"
                  }
               >
                  <Icons.popupArrow />
               </TooltipArrow> */}
               {children}
            </TooltipPrimitive.Popup>
         </TooltipPositioner>
      </TooltipPortal>
   )
}
