import { Route as homeRoute } from "@/routes/index"
import { Route as somethingRoute } from "@/routes/something"
import { Icons } from "@project/ui/components/icons"
import { Link } from "@tanstack/react-router"

export function BottomNavigation() {
   return (
      <nav className="fixed bottom-0 z-[2] h-(--bottom-menu-height) w-full border-gray-4 border-t bg-gray-1 p-1.5 shadow md:hidden dark:bg-gray-2">
         <ul className="flex flex-1 items-center justify-around gap-2">
            <li className="flex flex-1">
               <Link
                  activeOptions={{ exact: true }}
                  to={homeRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/60 aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-6" />
               </Link>
            </li>
            <li className="flex flex-1">
               <Link
                  to={somethingRoute.to}
                  className="group inline-flex h-10 flex-1 items-center justify-center rounded-md text-foreground/60 aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-6" />
               </Link>
            </li>
         </ul>
      </nav>
   )
}
