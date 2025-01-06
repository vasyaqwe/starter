import { Select as SelectPrimitive } from "@base-ui-components/react/select"
import { menuItemStyles, popupStyles } from "../constants"
import { cn } from "../utils"
import { buttonVariants } from "./button"
import { Icons } from "./icons"

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectIcon = SelectPrimitive.Icon
export const SelectItemIndicator = SelectPrimitive.ItemIndicator
export const SelectItemText = SelectPrimitive.ItemText
export const SelectGroup = SelectPrimitive.Group
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
            "justify-start",
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
            menuItemStyles.base,
            destructive ? menuItemStyles.destructive : "",
            "grid min-w-[calc(var(--anchor-width)+1.45rem)] grid-cols-[1.1rem_1fr] items-center gap-2 pr-4 pl-2",
            className,
         )}
         {...props}
      >
         <SelectItemIndicator className="col-start-1">
            <Icons.check className={"size-[18px] text-white/90"} />
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
                  popupStyles.base,
                  popupStyles.transition,
                  "!scale-100 min-w-36 p-(--padding) transition-none [--padding:3px]",
                  className,
               )}
            >
               {children}
            </SelectPrimitive.Popup>
         </SelectPositioner>
      </SelectPortal>
   )
}

export function SelectSeparator({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
   return (
      <SelectPrimitive.Separator
         className={cn(popupStyles.separator, className)}
         {...props}
      />
   )
}
