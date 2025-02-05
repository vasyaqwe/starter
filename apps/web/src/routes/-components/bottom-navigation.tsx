import { Icons } from "@project/ui/components/icons"
import { Link } from "@tanstack/react-router"

export function BottomNavigation() {
   return (
      <nav className="fixed bottom-0 z-[2] flex h-(--bottom-navigation-height) w-full items-center border-neutral border-t bg-background px-1.5 shadow md:hidden">
         <ul className="flex grow items-center justify-around gap-2">
            <li>
               <Link
                  to={"/"}
                  className="group relative inline-flex h-10 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
               >
                  <Icons.home className="size-6 shrink-0 group-aria-[current=page]:hidden" />
                  <Icons.homeSolid className="hidden size-6 shrink-0 group-aria-[current=page]:block" />
                  Home
               </Link>
            </li>
            <li>
               <Link
                  to={"/chat"}
                  className="group relative inline-flex h-10 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
               >
                  <Icons.chat className="ml-[3px] size-6 shrink-0 group-aria-[current=page]:hidden" />
                  <Icons.chatSolid className="ml-[3px] hidden size-6 shrink-0 group-aria-[current=page]:block" />
                  Chat
                  <span className="-right-1 absolute top-0.5 size-1.5 rounded-full bg-accent" />
               </Link>
            </li>
            <li>
               <Link
                  to={"/settings"}
                  className="group relative inline-flex h-10 flex-col items-center justify-center rounded-md font-bold text-foreground/60 text-xs aria-[current=page]:text-foreground"
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
