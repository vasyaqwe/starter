import type { User } from "@project/db/schema/user"
import { cn } from "@project/ui/utils"
import type { ComponentProps } from "react"

type UserAvatarProps = ComponentProps<"div"> & {
   user: Partial<User>
}

export function UserAvatar({
   user,
   className,
   children,
   ...props
}: UserAvatarProps) {
   const name =
      user.name && user.name !== ""
         ? user.name[0]?.toUpperCase()
         : (user.email?.[0]?.toUpperCase() ?? "?")

   return (
      <div
         {...props}
         className={cn(
            "relative size-8 [--online-indicator-size:0.875rem]",
            className,
         )}
      >
         {user.avatarUrl ? (
            <img
               src={user.avatarUrl}
               alt={name}
               referrerPolicy="no-referrer"
               className={cn(
                  "grid h-[inherit] w-full place-content-center rounded-full object-cover object-top",
               )}
            />
         ) : (
            <span
               className={cn(
                  "border bg-background text-foreground/75 shadow-inner",
                  className,
               )}
            >
               {name}
            </span>
         )}
         {children}
      </div>
   )
}

export function OnlineIndicator() {
   // const { user: currentUser } = useAuth()

   // const isUserOnline = usePresenceStore.use.isUserOnline()
   // const isOnline = user.id === currentUser.id || isUserOnline(user.id ?? "")

   const isOnline = false

   return (
      <span
         title={"Online"}
         data-online-indicator
         className={cn(
            "-right-0.5 -bottom-0.5 absolute block size-(--online-indicator-size) rounded-full border-[3px] border-background bg-green-500 transition-all duration-300",
            isOnline
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0",
         )}
      />
   )
}