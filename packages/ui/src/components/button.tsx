import { type VariantProps, cva } from "class-variance-authority"
import { focusStyles, menuItemStyles } from "../constants"
import { cn } from "../utils"
import { Loading } from "./loading"

const buttonVariants = cva(
   `inline-flex cursor-(--cursor) items-center justify-center gap-2 whitespace-nowrap 
    disabled:opacity-70 disabled:cursor-not-allowed border overflow-hidden relative`,
   {
      variants: {
         variant: {
            default: `shadow-sm transition-colors duration-50 bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 data-[popup-open]:bg-black-a10
                      dark:shadow-md dark:bg-primary-7 dark:text-primary-12 dark:border-primary-8 dark:hover:bg-primary-8/80
                      dark:hover:border-primary-9 dark:data-[popup-open]:border-primary-9 dark:data-[popup-open]:bg-primary-8/80`,
            // default (white in dark mode): `shadow-sm dark:shadow-md bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 dark:hover:bg-white dark:data-[popup-open]:bg-white data-[popup-open]:bg-black-a10`,
            secondary: `transition-colors duration-50 shadow-xs bg-primary-3 border-primary-a3 data-[popup-open]:bg-primary-3 hover:bg-primary-a4
                        dark:shadow-md dark:bg-primary-4 dark:data-[popup-open]:bg-primary-4`,
            destructive: `transition-colors duration-50 shadow-xs bg-red-9 border-red-11 text-white hover:bg-red-10 dark:shadow-md dark:border-red-11/65`,
            ghost: `border-transparent [--hover:var(--color-primary-3)] hover:bg-(--hover) aria-[current=page]:bg-(--hover) data-[popup-open]:bg-(--hover) 
                    dark:[--hover:var(--color-primary-4)] disabled:hover:bg-transparent`,
            "menu-item": cn(
               `justify-start border-transparent`,
               menuItemStyles.base,
            ),
         },
         size: {
            default: "h-8 rounded-[10px] px-3 text-sm",
            sm: "h-7 rounded-lg px-2.5 text-sm",
            lg: "h-10 gap-2 rounded-xl px-4 text-base",
            xl: "h-11 gap-3 rounded-xl px-4 text-base",
            icon: "size-9 gap-0 rounded-[10px]",
            "icon-sm": "size-8 gap-0 rounded-[9px]",
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
   children,
   isPending,
   ...props
}: React.ComponentProps<"button"> &
   VariantProps<typeof buttonVariants> & { isPending?: boolean | undefined }) {
   return (
      <button
         className={cn(buttonVariants({ variant, size, className }))}
         ref={ref}
         {...props}
      >
         {isPending === undefined ? (
            children
         ) : (
            <>
               <span
                  className={cn(
                     "data-[inactive]:-translate-y-4 invisible flex items-center justify-center gap-2 transition-all duration-200 ease-vaul data-[active]:visible data-[active]:translate-y-0 data-[inactive]:scale-90 data-[active]:opacity-100 data-[inactive]:opacity-0",
                  )}
                  data-active={!isPending ? "" : undefined}
                  data-inactive={isPending ? "" : undefined}
               >
                  {children}
               </span>
               <span
                  data-active={isPending ? "" : undefined}
                  className={cn(
                     "invisible absolute inset-0 m-auto block h-fit translate-y-4 opacity-0 transition-all duration-200 ease-vaul data-[active]:visible data-[active]:translate-y-0 data-[active]:opacity-100",
                  )}
               >
                  <Loading className="mx-auto" />
               </span>
            </>
         )}
      </button>
   )
}

export { Button, buttonVariants }
