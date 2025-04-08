import { ScrollArea } from "@project/ui/components/scroll-area"
import { cn } from "@project/ui/utils"

interface Props extends React.ComponentProps<typeof ScrollArea> {
   containerClassName?: string
}

export function Main({
   children,
   className,
   containerClassName,
   ...props
}: Props) {
   return (
      <ScrollArea
         className={cn("pt-4 pb-14 md:pt-6", className)}
         {...props}
      >
         <div className={cn("container", containerClassName)}>{children}</div>
      </ScrollArea>
   )
}
