import { cn } from "../../utils"

export function ChartContainer({
   className,
   children,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("relative", className)}
         {...props}
      >
         <div className="-mt-2 absolute inset-0 m-auto size-[90%] bg-[radial-gradient(var(--color-primary-4)_1px,transparent_1px)] [background-size:11px_11px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
         {children}
      </div>
   )
}
