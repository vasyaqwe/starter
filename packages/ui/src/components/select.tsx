import { Select as SelectPrimitive } from "@base-ui-components/react/select"
import {
   menuItemDestructiveStyles,
   menuItemStyles,
   popupStyles,
   popupTransitionStyles,
} from "../constants"
import { cn } from "../utils"
import { buttonVariants } from "./button"
import { Icons } from "./icons"

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectIcon = SelectPrimitive.Icon
export const SelectItemIndicator = SelectPrimitive.ItemIndicator
export const SelectItemText = SelectPrimitive.ItemText
export const SelectGroup = SelectPrimitive.Group
export const SelectSeparator = SelectPrimitive.Separator
export const SelectPortal = SelectPrimitive.Portal
export const SelectBackdrop = SelectPrimitive.Backdrop
export const SelectPositioner = SelectPrimitive.Positioner
export const SelectArrow = SelectPrimitive.Arrow

export function SelectTrigger({
   className,
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
   return (
      <SelectPrimitive.Trigger
         className={cn(
            buttonVariants({ variant: "secondary" }),
            "justify-start font-normal",
            className,
         )}
         {...props}
      >
         {children}
         <SelectIcon className="-mr-1 ml-auto flex">
            <Icons.chevronUpDown className="size-4 text-foreground/75" />
         </SelectIcon>
      </SelectPrimitive.Trigger>
   )
}

export function SelectItem({
   className,
   destructive = false,
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
   destructive?: boolean
}) {
   return (
      <SelectPrimitive.Item
         className={cn(
            buttonVariants({ variant: "popover" }),
            menuItemStyles,
            destructive ? menuItemDestructiveStyles : "",
            "grid min-w-[calc(var(--anchor-width)+1.25rem)] grid-cols-[1.25rem_1fr] items-center gap-2 pr-4 pl-2 text-sm",
            className,
         )}
         {...props}
      >
         <SelectItemIndicator className="col-start-1">
            <Icons.check className={"size-[18px] text-foreground/90"} />
         </SelectItemIndicator>
         <SelectItemText className={"col-start-2"}>{children}</SelectItemText>
      </SelectPrimitive.Item>
   )
}

export function SelectPopup({
   className,
   children,
   sideOffset = 0,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Positioner>) {
   return (
      <SelectPortal>
         <SelectBackdrop />
         <SelectPositioner
            sideOffset={sideOffset}
            {...props}
         >
            <SelectPrimitive.Popup
               className={cn(
                  popupStyles,
                  popupTransitionStyles,
                  "!scale-100 min-w-32 p-(--padding) text-base transition-none [--padding:3px]",
                  className,
               )}
            >
               {children}
            </SelectPrimitive.Popup>
         </SelectPositioner>
      </SelectPortal>
   )
}
