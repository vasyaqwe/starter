import { Popover as PopoverPrimitive } from "@base-ui-components/react/popover"
import { popupStyles } from "../constants"
import { cn } from "../utils"

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverPortal = PopoverPrimitive.Portal
export const PopoverPositioner = PopoverPrimitive.Positioner
export const PopoverArrow = PopoverPrimitive.Arrow

export function PopoverPopup({
   className,
   children,
   sideOffset = 7,
   ...props
}: React.ComponentProps<typeof PopoverPrimitive.Positioner>) {
   return (
      <PopoverPortal>
         <PopoverPositioner
            sideOffset={sideOffset}
            {...props}
         >
            <PopoverPrimitive.Popup
               className={cn(
                  popupStyles.base,
                  popupStyles.transition,
                  "px-3 py-2.5",
                  className,
               )}
            >
               {children}
            </PopoverPrimitive.Popup>
         </PopoverPositioner>
      </PopoverPortal>
   )
}
