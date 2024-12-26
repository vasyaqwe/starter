import { Route as homeRoute } from "@/routes/index"
import { Route as somethingRoute } from "@/routes/something"
import { Icons } from "@project/ui/components/icons"
import { cn } from "@project/ui/utils"
import { Link } from "@tanstack/react-router"

export function Sidebar() {
   return (
      <aside className="z-[10] h-svh w-[15rem] max-md:hidden">
         <div className="fixed flex h-full w-[15rem] flex-col border-elevated border-r p-4 shadow-xs">
            <nav className="my-4 overflow-y-auto">
               <ul className="space-y-1">
                  <li>
                     <Link
                        to={homeRoute.to}
                        className={cn(
                           "group flex h-8 items-center gap-2 rounded-lg border border-transparent px-2 font-semibold text-base text-foreground/70 leading-none hover:bg-elevated hover:text-foreground aria-[current=page]:bg-elevated aria-[current=page]:text-foreground",
                        )}
                     >
                        <Icons.home className="size-5" />
                        Home
                     </Link>
                  </li>
                  <li>
                     <Link
                        to={somethingRoute.to}
                        className={cn(
                           "group flex h-8 items-center gap-2 rounded-lg border border-transparent px-2 font-semibold text-base text-foreground/70 leading-none hover:bg-elevated hover:text-foreground aria-[current=page]:bg-elevated aria-[current=page]:text-foreground",
                        )}
                     >
                        <Icons.home className="size-5" />
                        Something
                     </Link>
                  </li>
               </ul>
            </nav>
         </div>
      </aside>
   )
}
