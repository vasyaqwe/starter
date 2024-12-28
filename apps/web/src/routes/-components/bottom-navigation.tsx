import { Route as chatRoute } from "@/routes/chat"
import { Route as homeRoute } from "@/routes/index"
import { Icons } from "@project/ui/components/icons"
import { Link } from "@tanstack/react-router"

export function BottomNavigation() {
   return (
      <nav className="fixed bottom-0 z-[2] flex h-(--bottom-navigation-height) w-full items-center border-gray-4 border-t bg-gray-1 px-1.5 shadow md:hidden dark:bg-gray-2">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  to={homeRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/60 aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-6" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  to={chatRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/60 aria-[current=page]:text-foreground"
               >
                  <Icons.chat className="size-6" />
               </Link>
            </li>
         </ul>
      </nav>
   )
}
