import { Switch as SwitchPrimitive } from "@base-ui-components/react/switch"
import { focusStyles } from "../constants"
import { cn } from "../utils"

function Switch({
   className,
   children,
   onCheckedChange,
   ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
   return (
      <SwitchPrimitive.Root
         onCheckedChange={(checked, e) => {
            onCheckedChange?.(checked, e)
         }}
         className={cn(
            "inline-flex h-[23px] w-[38px] cursor-(--cursor) items-center rounded-full bg-gray-6 shadow-xs hover:bg-gray-7 data-checked:bg-accent data-checked:hover:bg-accent/90",
            focusStyles,
            className,
         )}
         {...props}
      >
         {children}
         <SwitchThumb />
      </SwitchPrimitive.Root>
   )
}

function SwitchThumb({
   className,
   ...props
}: React.ComponentProps<typeof SwitchPrimitive.Thumb>) {
   return (
      <SwitchPrimitive.Thumb
         className={cn(
            "ml-[3px] block size-[17px] rounded-full bg-[#fff] shadow-2xs transition-transform ease-vaul data-checked:translate-x-[calc(100%-2px)]",
            className,
         )}
         {...props}
      />
   )
}

export { Switch, SwitchThumb }
