import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"
import { focusStyles } from "../constants"
import { cn } from "../utils"

const buttonVariants = cva(
   `inline-flex cursor-pointer items-center font-semibold justify-center gap-1.5 whitespace-nowrap 
    disabled:opacity-70 disabled:cursor-not-allowed border dark:shadow-md`,
   {
      variants: {
         variant: {
            default: `bg-gray-12 text-gray-1 dark:shadow-md shadow-sm border-gray-12 hover:bg-black-a10 dark:hover:bg-white dark:hover:brightness-100`,
            secondary: `bg-gray-3 dark:bg-gray-4 hover:bg-gray-a4 border-gray-a3`,
            destructive: `bg-red-9 hover:bg-red-10 text-white dark:border-red-11/65 border-red-11`,
            ghost: "border-transparent shadow-none hover:bg-gray-3 dark:shadow-none dark:hover:bg-gray-4",
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
