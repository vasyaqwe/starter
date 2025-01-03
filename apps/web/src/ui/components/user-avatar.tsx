import type { User } from "@project/db/schema/user"
import { cn } from "@project/ui/utils"

type UserAvatarProps = React.ComponentProps<"div"> & {
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
         className={cn("relative size-8", className)}
         {...props}
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

export function OnlineIndicator({
   className,
   ...props
}: React.ComponentProps<"span">) {
   // const { user: currentUser } = useAuth()

   // const isUserOnline = usePresenceStore.use.isUserOnline()
   // const isOnline = user.id === currentUser.id || isUserOnline(user.id ?? "")

   const isOnline = true

   return (
      <span
         title={"Online"}
         className={cn(
            "-right-0.5 -bottom-0.5 absolute block size-3.5 rounded-full border-[3px] border-[canvas] bg-green-400 transition-all duration-300",
            isOnline
               ? "visible scale-100 opacity-100"
               : "invisible scale-0 opacity-0",
            className,
         )}
         {...props}
      />
   )
}
