import { Menu as MenuPrimitive } from "@base-ui-components/react/menu"
import { menuItemStyles, popupStyles } from "../constants"
import { cn } from "../utils"
import { Icons } from "./icons"

export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger
export const MenuGroup = MenuPrimitive.Group
// export const MenuRadioGroup = MenuPrimitive.RadioGroup
export const MenuRadioItem = MenuPrimitive.RadioItem
export const MenuPortal = MenuPrimitive.Portal
export const MenuBackdrop = MenuPrimitive.Backdrop
export const MenuPositioner = MenuPrimitive.Positioner
export const MenuArrow = MenuPrimitive.Arrow

export function MenuGroupLabel({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel>) {
   return (
      <MenuPrimitive.GroupLabel
         className={cn("my-1 ml-2 text-sm text-white/75 uppercase", className)}
         {...props}
      >
         {children}
      </MenuPrimitive.GroupLabel>
   )
}

export function MenuItem({
   className,
   destructive = false,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
   destructive?: boolean
}) {
   return (
      <MenuPrimitive.Item
         className={cn(
            menuItemStyles.base,
            destructive ? menuItemStyles.destructive : "",
            className,
         )}
         {...props}
      >
         {children}
      </MenuPrimitive.Item>
   )
}

export function MenuCheckboxItem({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
   return (
      <MenuPrimitive.CheckboxItem
         className={cn(
            menuItemStyles.base,
            "grid min-w-[calc(var(--anchor-width)+1.45rem)] grid-cols-[1.1rem_1fr] items-center gap-2 pr-4 pl-2",
            className,
         )}
         {...props}
      >
         <MenuPrimitive.CheckboxItemIndicator className="col-start-1">
            <Icons.check className={"size-[18px] text-white/90"} />
         </MenuPrimitive.CheckboxItemIndicator>
         <span className={"col-start-2"}>{children}</span>
      </MenuPrimitive.CheckboxItem>
   )
}

export function MenuPopup({
   className,
   children,
   sideOffset = 7,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.Positioner>) {
   return (
      <MenuPortal>
         <MenuBackdrop />
         <MenuPositioner
            sideOffset={sideOffset}
            {...props}
         >
            <MenuPrimitive.Popup
               className={cn(
                  popupStyles.base,
                  popupStyles.transition,
                  "min-w-36 p-(--padding) text-base [--padding:3px]",
                  className,
               )}
            >
               {children}
            </MenuPrimitive.Popup>
         </MenuPositioner>
      </MenuPortal>
   )
}

export function MenuSeparator({
   className,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
   return (
      <MenuPrimitive.Separator
         className={cn(popupStyles.separator, className)}
         {...props}
      />
   )
}
