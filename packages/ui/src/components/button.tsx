import { type VariantProps, cva } from "class-variance-authority"
import { focusStyles } from "../constants"
import { cn } from "../utils"

const buttonVariants = cva(
   `inline-flex cursor-(--cursor) items-center font-semibold justify-center gap-1.5 whitespace-nowrap 
    disabled:opacity-70 disabled:cursor-not-allowed border`,
   {
      variants: {
         variant: {
            default: `shadow-sm bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 data-[popup-open]:bg-black-a10
                      dark:shadow-md dark:bg-primary-7 dark:text-primary-12 dark:border-primary-8 dark:hover:bg-primary-8/80
                      dark:hover:border-primary-9 dark:data-[popup-open]:border-primary-9 dark:data-[popup-open]:bg-primary-8/80`,
            // default (white in dark mode): `shadow-sm dark:shadow-md bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 dark:hover:bg-white dark:data-[popup-open]:bg-white data-[popup-open]:bg-black-a10`,
            secondary: `shadow-xs bg-primary-3 border-primary-a3 data-[popup-open]:bg-primary-3 hover:bg-primary-a4
                        dark:shadow-md dark:bg-primary-4 dark:data-[popup-open]:bg-primary-4`,
            destructive: `shadow-xs bg-red-9 border-red-11 text-white hover:bg-red-10 dark:shadow-md dark:border-red-11/65`,
            ghost: `border-transparent [--hover:var(--color-primary-3)] hover:bg-(--hover) aria-[current=page]:bg-(--hover) data-[popup-open]:bg-(--hover) 
                    dark:[--hover:var(--color-primary-4)]`,
            popover: `justify-start gap-2 border-transparent font-normal hover:bg-primary-11 hover:shadow-lg
                      focus-visible:outline-none focus-visible:outline-hidden focus-visible:bg-primary-11 focus-visible:shadow-lg
                      dark:hover:bg-primary-6 dark:focus-visible:bg-primary-6`,
         },
         size: {
            default: "h-8 rounded-[10px] px-3 text-sm",
            sm: "h-7 rounded-lg px-2.5 text-sm",
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
