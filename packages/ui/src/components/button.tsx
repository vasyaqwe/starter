import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"
import { focusStyles } from "../constants"
import { cn } from "../utils"

const buttonVariants = cva(
   `relative inline-flex cursor-pointer items-center justify-center font-medium gap-1.5 leading-none overflow-hidden whitespace-nowrap 
    disabled:opacity-70 disabled:cursor-not-allowed border border-transparent`,
   {
      variants: {
         variant: {
            default: `bg-gray-12 text-gray-1 shadow-sm hover:saturate-120 hover:brightness-120 
            hover:contrast-90 dark:hover:contrast-100 dark:brightness-95 dark:hover:brightness-105`,
            secondary: `bg-gray-4 hover:bg-gray-a5`,
            destructive: `bg-red-9 hover:bg-red-10 text-white`,
            ghost: "hover:bg-gray-4",
         },
         size: {
            default: "h-8 rounded-[10px] px-3 text-sm",
            sm: "h-8 rounded-lg px-2.5 text-sm",
            lg: "h-10 gap-2 rounded-xl px-4 text-base",
            xl: "h-11 gap-3 rounded-xl px-4 text-base",
            icon: "size-9 gap-0 rounded-full",
            "icon-sm": "size-8 gap-0 rounded-full",
         },
      },
      compoundVariants: [
         {
            className: focusStyles,
         },
      ],
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

function Button({
   className,
   variant,
   size,
   ref,
   ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
   return (
      <button
         className={cn(buttonVariants({ variant, size, className }))}
         ref={ref}
         {...props}
      />
   )
}

export { Button, buttonVariants }
