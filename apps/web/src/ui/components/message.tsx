import { cn } from "@project/ui/utils"

export function Message({
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
         )}
         {...props}
      />
   )
}