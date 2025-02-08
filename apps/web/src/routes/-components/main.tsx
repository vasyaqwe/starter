import { ScrollArea } from "@project/ui/components/scroll-area"
import { cn } from "@project/ui/utils"

export function Main({
   children,
   className,
   containerClassName,
   ...props
}: React.ComponentProps<typeof ScrollArea> & { containerClassName?: string }) {
   return (
      <ScrollArea
         className={cn("pt-4 pb-14 md:pt-6", className)}
         {...props}
      >
         <div className={cn("container", containerClassName)}>{children}</div>
      </ScrollArea>
   )
}
