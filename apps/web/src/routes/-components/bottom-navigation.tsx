import { Route as chatRoute } from "@/routes/_layout/chat"
import { Route as indexRoute } from "@/routes/_layout/index"
import { Route as settingsRoute } from "@/routes/_layout/settings"
import { Icons } from "@project/ui/components/icons"
import { Link } from "@tanstack/react-router"

export function BottomNavigation() {
   return (
      <nav className="fixed bottom-0 z-[2] flex h-(--bottom-navigation-height) w-full items-center border-primary-4 border-t bg-background px-1.5 shadow md:hidden">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  to={indexRoute.to}
                  className="group inline-flex h-10 flex-1 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-6 shrink-0 group-aria-[current=page]:hidden" />
                  <Icons.homeSolid className="hidden size-6 shrink-0 group-aria-[current=page]:block" />
                  Home
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  to={chatRoute.to}
                  className="group inline-flex h-10 flex-1 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
               >
                  <Icons.chat className="size-6 shrink-0 group-aria-[current=page]:hidden" />
                  <Icons.chatSolid className="hidden size-6 shrink-0 group-aria-[current=page]:block" />
                  Chat
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  to={settingsRoute.to}
                  className="group inline-flex h-10 flex-1 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
               >
                  <Icons.gear className="size-6 shrink-0 group-aria-[current=page]:hidden" />
                  <Icons.gearSolid className="hidden size-6 shrink-0 group-aria-[current=page]:block" />
                  Settings
               </Link>
            </li>
         </ul>
      </nav>
   )
}
