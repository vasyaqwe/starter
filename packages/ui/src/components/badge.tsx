import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils"

const badgeVariants = cva(
   `inline-flex items-center justify-center gap-2 border whitespace-nowrap`,
   {
      variants: {
         variant: {
            default: `shadow-xs bg-background border-neutral text-foreground/95 dark:shadow-md dark:border-primary-5 dark:bg-primary-4`,
         },
         size: {
            default: "h-8 rounded-[10px] px-3 text-sm",
            sm: "h-[29px] rounded-lg px-2.5 text-xs",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   },
)

function Badge({
   className,
   variant,
   size,
   ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
   return (
      <span
         className={cn(badgeVariants({ variant, size, className }))}
         {...props}
      />
   )
}

export { Badge, badgeVariants }
