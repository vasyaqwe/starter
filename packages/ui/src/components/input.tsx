import { Input as InputPrimitive } from "@base-ui-components/react/input"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils"

export const inputVariants = cva(
   `w-full border outline-hidden rounded-[10px] placeholder:text-foreground/40`,
   {
      variants: {
         variant: {
            default: `border-primary-6 bg-white focus:border-primary-11 dark:bg-primary-2`,
            chat: "min-h-[41px] rounded-full border-primary-5 bg-primary-2 px-4 py-2 dark:border-primary-6 dark:bg-primary-3",
         },
         size: {
            default: "h-10 px-3 text-base md:h-9",
         },
      },
      compoundVariants: [
         {
            variant: "chat",
            className: "h-auto px-4",
         },
      ],
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

export function Input({
   className,
   variant,
   size,
   ...props
}: React.ComponentProps<typeof InputPrimitive> &
   VariantProps<typeof inputVariants>) {
   return (
      <InputPrimitive
         className={cn(inputVariants({ variant, size, className }))}
         {...props}
      />
   )
}
