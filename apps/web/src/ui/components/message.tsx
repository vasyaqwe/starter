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
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "mt-7 text-center font-semibold text-foreground/60 text-sm uppercase",
            className,
         )}
         {...props}
      />
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
   isFirst,
   isLast,
   isMine,
   isOnlyOne,
   ...props
}: React.ComponentProps<"div"> & {
   isMine: boolean
   isOnlyOne: boolean
   isFirst: boolean
   isLast: boolean
}) {
   return (
      <div
         className={cn(
            "w-fit max-w-[30rem] shrink-0 px-3 py-2 dark:shadow-md",
            isMine
               ? "rounded-r-md rounded-l-3xl bg-accent text-white"
               : "rounded-r-3xl rounded-l-md bg-primary-3 dark:bg-primary-5",
            isOnlyOne ? "!rounded-3xl" : "",
            isFirst && !isMine ? "rounded-tl-3xl" : "",
            isLast && !isMine ? "rounded-bl-3xl" : "",
            isFirst && isMine ? "rounded-tr-3xl" : "",
            isLast && isMine ? "rounded-br-3xl" : "",
            className,
         )}
         {...props}
      />
   )
}
