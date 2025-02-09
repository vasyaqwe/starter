import { type VariantProps, cva } from "class-variance-authority"
import { focusStyles, menuItemStyles } from "../constants"
import { cn } from "../utils"
import { Loading } from "./loading"

const buttonVariants = cva(
   `inline-flex cursor-(--cursor) items-center justify-center whitespace-nowrap 
    disabled:opacity-70 disabled:cursor-not-allowed border overflow-hidden relative`,
   {
      variants: {
         variant: {
            default: `shadow-sm transition-[background-color] duration-50 bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 data-[popup-open]:bg-black-a10
                      dark:shadow-md dark:bg-primary-7 dark:text-primary-12 dark:border-primary-8 dark:hover:bg-primary-8/80
                      dark:hover:border-primary-9 dark:data-[popup-open]:border-primary-9 dark:data-[popup-open]:bg-primary-8/80`,
            // default (white in dark mode): `shadow-sm dark:shadow-md bg-primary-12 text-primary-1 border-primary-12 hover:bg-black-a10 dark:hover:bg-white dark:data-[popup-open]:bg-white data-[popup-open]:bg-black-a10`,
            secondary: `transition-[background-color] duration-50 shadow-xs bg-primary-3 border-primary-a3 data-[popup-open]:bg-primary-a4 hover:bg-primary-a4
                        dark:shadow-md dark:bg-primary-4`,
            destructive: `transition-[background-color] duration-50 shadow-xs bg-red-9 border-red-11 text-white hover:bg-red-10 dark:shadow-md dark:border-red-11/65`,
            ghost: `border-transparent [--hover:var(--color-primary-3)] hover:bg-(--hover) aria-[current=page]:bg-(--hover) data-[popup-open]:bg-(--hover) 
                    dark:[--hover:var(--color-primary-4)] disabled:hover:bg-transparent`,
            "menu-item": cn(
               `justify-start border-transparent`,
               menuItemStyles.base,
            ),
         },
         size: {
            default:
               "h-10 rounded-[12px] px-3 text-base md:h-8 md:rounded-[10px] md:text-sm",
            xs: "h-9 rounded-[10px] md:h-7 md:rounded-[9px]",
            sm: "h-9 rounded-[10px] px-2.5 text-base md:h-8 md:text-sm",
            lg: "h-10 gap-2 rounded-xl px-4 text-base",
            xl: "h-11 gap-3 rounded-xl px-4 text-base",
         },
         kind: {
            default: "gap-2",
            icon: "aspect-square w-auto justify-center gap-0 px-0",
         },
         shape: {
            default: "",
            circle: "!rounded-full",
         },
      },
      compoundVariants: [
         {
            className: focusStyles,
         },
         {
            kind: "icon",
            size: "default",
            className: "md:h-9",
         },
      ],
      defaultVariants: {
         variant: "default",
         size: "default",
         kind: "default",
         shape: "default",
      },
   },
)

type ButtonProps = React.ComponentProps<"button"> &
   VariantProps<typeof buttonVariants>

function Button({
   className,
   variant,
   size,
   kind,
   shape,
   children,
   isPending,
   ...props
}: ButtonProps & { isPending?: boolean | undefined }) {
   return (
      <button
         className={cn(
            buttonVariants({ variant, size, kind, shape, className }),
         )}
         {...props}
      >
         {isPending === undefined ? (
            children
         ) : (
            <>
               <span
                  className={cn(
                     "data-[inactive]:-translate-y-6 md:data-[inactive]:-translate-y-4 invisible flex items-center justify-center gap-2 transition-all duration-200 ease-vaul data-[active]:visible data-[active]:translate-y-0 data-[inactive]:scale-90 data-[active]:opacity-100 data-[inactive]:opacity-0",
                  )}
                  data-active={!isPending ? "" : undefined}
                  data-inactive={isPending ? "" : undefined}
               >
                  {children}
               </span>
               <span
                  data-active={isPending ? "" : undefined}
                  className={cn(
                     "invisible absolute inset-0 m-auto block h-fit translate-y-6 opacity-0 transition-all duration-200 ease-vaul data-[active]:visible data-[active]:translate-y-0 data-[active]:opacity-100 md:translate-y-4",
                  )}
               >
                  <Loading className="mx-auto" />
               </span>
            </>
         )}
      </button>
   )
}

export { Button, buttonVariants, type ButtonProps }
