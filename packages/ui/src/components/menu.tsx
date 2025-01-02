import { Menu as MenuPrimitive } from "@base-ui-components/react/menu"
import { menuItemStyles, popupStyles } from "../constants"
import { cn } from "../utils"

export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger
export const MenuGroup = MenuPrimitive.Group
export const MenuCheckboxItem = MenuPrimitive.CheckboxItem
// export const MenuRadioGroup = MenuPrimitive.RadioGroup
export const MenuRadioItem = MenuPrimitive.RadioItem
export const MenuPortal = MenuPrimitive.Portal
export const MenuBackdrop = MenuPrimitive.Backdrop
export const MenuPositioner = MenuPrimitive.Positioner
export const MenuArrow = MenuPrimitive.Arrow

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
                  "min-w-32 p-(--padding) text-base [--padding:3px]",
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
