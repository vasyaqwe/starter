import { Badge } from "@project/ui/components/badge"
import { Separator } from "@project/ui/components/separator"
import { cn } from "@project/ui/utils"

export function MessageGroup({
   className,
   isMine,
   ...props
}: React.ComponentProps<"div"> & {
   isMine: boolean
}) {
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

export function Message({
   className,
   isMine,
   ...props
}: React.ComponentProps<"div"> & {
   isMine: boolean
}) {
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

export function MessageContent({
   className,
   isMine,
   state,
   ...props
}: React.ComponentProps<"div"> & {
   isMine: boolean
   state: "first" | "last" | "single" | "middle"
}) {
   return (
      <div
         className={cn(
            "w-fit max-w-[82%] shrink-0 px-3 py-2 sm:max-w-[30rem] md:max-w-[25rem] lg:max-w-[32rem] dark:shadow-md",
            isMine
               ? "rounded-r-md rounded-l-3xl bg-accent-8 text-white"
               : "rounded-r-3xl rounded-l-md bg-primary-3 dark:bg-primary-5",
            state === "single" ? "!rounded-3xl" : "",
            state === "first" && !isMine ? "rounded-tl-3xl" : "",
            state === "last" && !isMine ? "rounded-bl-3xl" : "",
            state === "first" && isMine ? "rounded-tr-3xl" : "",
            state === "last" && isMine ? "rounded-br-3xl" : "",
            className,
         )}
         {...props}
      />
   )
}
