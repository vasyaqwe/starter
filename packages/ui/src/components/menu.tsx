import { Menu as MenuPrimitive } from "@base-ui-components/react/menu"
import { popupStyles, popupTransitionStyles } from "../constants"
import { cn } from "../utils"

export const Menu = MenuPrimitive.Root
export const MenuTrigger = MenuPrimitive.Trigger
export const MenuGroup = MenuPrimitive.Group
export const MenuSeparator = MenuPrimitive.Separator
export const MenuCheckboxItem = MenuPrimitive.CheckboxItem
// export const MenuRadioGroup = MenuPrimitive.RadioGroup
export const MenuRadioItem = MenuPrimitive.RadioItem
export const MenuPortal = MenuPrimitive.Portal
export const MenuBackdrop = MenuPrimitive.Backdrop
export const MenuPositioner = MenuPrimitive.Positioner

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
            "flex cursor-(--cursor) items-center gap-2 rounded-[calc(12px-var(--padding))] px-2 py-[5px] hover:shadow-lg focus:shadow-lg focus:outline-hidden",
            "[&>svg]:size-5 [&>svg]:text-gray-8 hover:[&>svg]:text-white focus:[&>svg]:text-white dark:[&>svg]:text-gray-11",
            destructive
               ? "hover:bg-red-9 focus:bg-red-9"
               : "hover:bg-gray-11 focus:bg-gray-11 dark:focus:bg-gray-6 dark:hover:bg-gray-6",
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
                  popupStyles,
                  popupTransitionStyles,
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
