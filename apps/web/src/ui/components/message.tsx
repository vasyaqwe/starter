import { Badge } from "@project/ui/components/badge"
import { Separator } from "@project/ui/components/separator"
import { cn } from "@project/ui/utils"

interface Props extends React.ComponentProps<"div"> {
   isMine: boolean
}

export function MessageGroup({ className, isMine, ...props }: Props) {
   return (
      <div
         className={cn(
            "flex gap-2",
            isMine ? "flex-row-reverse" : "",
            className,
         )}
         {...props}
      />
   )
}

export function MessageGroupDate({
   className,
   children,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "my-9 flex items-center justify-center text-center font-semibold text-foreground/60 text-sm uppercase",
            className,
         )}
         {...props}
      >
         <Separator className="grow" />
         <Badge
            size={"sm"}
            className="rounded-full px-4"
         >
            {children}
         </Badge>
         <Separator className="grow" />
      </div>
   )
}

interface MessageProps extends React.ComponentProps<"div"> {
   isMine: boolean
}

export function Message({ className, isMine, ...props }: MessageProps) {
   return (
      <div
         className={cn(
            "group mt-0.5 flex items-center justify-end gap-2",
            isMine ? "" : "flex-row-reverse",
            className,
         )}
         {...props}
      />
   )
}

export function MessageActions({
   className,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "opacity-0 group-hover:opacity-100 has-[[data-popup-open]]:opacity-100",
            className,
         )}
         {...props}
      />
   )
}

interface MessageContentProps extends React.ComponentProps<"div"> {
   isMine: boolean
   state: "first" | "last" | "single" | "middle"
}

export function MessageContent({
   className,
   isMine,
   state,
   ...props
}: MessageContentProps) {
   return (
      <div
         className={cn(
            "w-fit max-w-[82%] shrink-0 px-3 py-2 sm:max-w-[30rem] md:max-w-[25rem] lg:max-w-[32rem] dark:shadow-md",
            isMine
               ? "rounded-r-md rounded-l-[1.25rem] bg-accent-8 text-white"
               : "rounded-r-[1.25rem] rounded-l-md bg-primary-3 dark:bg-primary-5",
            state === "single" ? "!rounded-[1.25rem]" : "",
            state === "first" && !isMine ? "rounded-tl-[1.25rem]" : "",
            state === "last" && !isMine ? "rounded-bl-[1.25rem]" : "",
            state === "first" && isMine ? "rounded-tr-[1.25rem]" : "",
            state === "last" && isMine ? "rounded-br-[1.25rem]" : "",
            className,
         )}
         {...props}
      />
   )
}
