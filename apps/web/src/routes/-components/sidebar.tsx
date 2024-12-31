import { Route as chatRoute } from "@/routes/_layout/chat"
import { Route as indexRoute } from "@/routes/_layout/index"
import { Route as settingsRoute } from "@/routes/_layout/settings"
import { Route as loginRoute } from "@/routes/login"
import {
   Accordion,
   AccordionItem,
   AccordionPanel,
   AccordionTrigger,
} from "@project/ui/components/accordion"
import { Button, buttonVariants } from "@project/ui/components/button"
import { Icons } from "@project/ui/components/icons"
import { ScrollArea } from "@project/ui/components/scroll-area"
import { cn } from "@project/ui/utils"
import { Link } from "@tanstack/react-router"
import { useTheme } from "next-themes"

export function Sidebar() {
   const { setTheme, resolvedTheme: theme } = useTheme()

   return (
      <aside className="z-[10] h-svh w-[15rem] max-md:hidden">
         <div className="fixed flex h-full w-[15rem] flex-col border-primary-4 border-r shadow-xs">
            <ScrollArea render={<nav className="p-4" />}>
               <ul className="space-y-1">
                  <li>
                     <Link
                        to={indexRoute.to}
                        className={cn(
                           buttonVariants({ variant: "ghost" }),
                           "group flex justify-start gap-2 px-2 font-semibold text-base text-foreground/70 leading-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <Icons.home className="size-5" />
                        Home
                     </Link>
                  </li>
                  <li>
                     <Link
                        to={chatRoute.to}
                        className={cn(
                           buttonVariants({ variant: "ghost" }),
                           "group flex justify-start gap-2 px-2 font-semibold text-base text-foreground/70 leading-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <Icons.chat className="size-5" />
                        Chat
                     </Link>
                  </li>
                  <li>
                     <Link
                        to={settingsRoute.to}
                        className={cn(
                           buttonVariants({ variant: "ghost" }),
                           "group flex justify-start gap-2 px-2 font-semibold text-base text-foreground/70 leading-none hover:text-foreground aria-[current=page]:text-foreground",
                        )}
                     >
                        <Icons.gear className="size-5" />
                        Settings
                     </Link>
                  </li>
               </ul>
               <Accordion className={"mt-4"}>
                  <AccordionItem>
                     <AccordionTrigger
                        className={cn(
                           buttonVariants({ variant: "ghost", size: "sm" }),
                           "mb-1 justify-start font-semibold",
                        )}
                     >
                        Favorites
                        <Icons.chevronDown className="-rotate-90 mt-[3px] size-2 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-0" />
                     </AccordionTrigger>
                     <AccordionPanel>
                        <ul className="space-y-1">
                           <li>
                              <Link
                                 to={loginRoute.to}
                                 className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "group flex justify-start gap-2 px-2.5 text-base text-foreground/70 leading-none hover:text-foreground aria-[current=page]:bg-transparent",
                                 )}
                              >
                                 Item 1
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to={loginRoute.to}
                                 className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "group flex justify-start gap-2 px-2.5 text-base text-foreground/70 leading-none hover:text-foreground aria-[current=page]:bg-transparent",
                                 )}
                              >
                                 Item 2
                              </Link>
                           </li>
                        </ul>
                     </AccordionPanel>
                  </AccordionItem>
               </Accordion>
            </ScrollArea>
            <div className="mt-auto p-4 pt-1">
               <Button
                  className="text-foreground/90"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  variant={"ghost"}
                  size={"icon"}
               >
                  {theme === "light" ? (
                     <svg
                        className="size-[18px]"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M6.99984 1.16675C3.77817 1.16675 1.1665 3.77842 1.1665 7.00008C1.1665 10.2217 3.77817 12.8334 6.99984 12.8334C10.2215 12.8334 12.8332 10.2217 12.8332 7.00008C12.8332 6.96036 12.8328 6.92069 12.832 6.8812C12.8287 6.71926 12.7363 6.57244 12.5918 6.49941C12.4472 6.42643 12.2742 6.43921 12.142 6.53272C11.5956 6.919 10.9291 7.14592 10.2082 7.14592C8.35574 7.14592 6.854 5.64421 6.854 3.79175C6.854 3.07089 7.08092 2.40433 7.4672 1.85791C7.56071 1.72569 7.57349 1.55265 7.50051 1.40811C7.42748 1.26358 7.28065 1.17118 7.11872 1.16794C7.07917 1.16714 7.03956 1.16675 6.99984 1.16675Z"
                           fill="currentColor"
                        />
                     </svg>
                  ) : (
                     <svg
                        className="size-[18px]"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M7.43652 1.03101C7.43652 0.789378 7.24064 0.593506 6.99902 0.593506C6.75741 0.593506 6.56152 0.789378 6.56152 1.03101V1.91957C6.56152 2.1612 6.75741 2.35707 6.99902 2.35707C7.24064 2.35707 7.43652 2.1612 7.43652 1.91957V1.03101Z"
                           fill="currentColor"
                        />
                        <path
                           d="M2.46896 10.9115C2.29811 11.0823 2.29811 11.3594 2.46896 11.5302C2.63982 11.7011 2.91682 11.7011 3.08768 11.5302L3.71599 10.9019C3.88684 10.7311 3.88684 10.454 3.71599 10.2832C3.54514 10.1123 3.26812 10.1123 3.09727 10.2832L2.46896 10.9115Z"
                           fill="currentColor"
                        />
                        <path
                           d="M6.99902 11.6431C7.24064 11.6431 7.43652 11.8389 7.43652 12.0806V12.9692C7.43652 13.2108 7.24064 13.4067 6.99902 13.4067C6.75741 13.4067 6.56152 13.2108 6.56152 12.9692V12.0806C6.56152 11.8389 6.75741 11.6431 6.99902 11.6431Z"
                           fill="currentColor"
                        />
                        <path
                           d="M10.282 3.09849C10.1111 3.26935 10.1111 3.54635 10.282 3.71721C10.4528 3.88807 10.7298 3.88807 10.9007 3.71721L11.529 3.0889C11.6999 2.91805 11.6999 2.64103 11.529 2.47018C11.3581 2.29933 11.0811 2.29933 10.9103 2.47018L10.282 3.09849Z"
                           fill="currentColor"
                        />
                        <path
                           d="M11.6416 7C11.6416 6.75838 11.8375 6.5625 12.0791 6.5625H12.9677C13.2093 6.5625 13.4052 6.75838 13.4052 7C13.4052 7.24167 13.2093 7.4375 12.9677 7.4375H12.0791C11.8375 7.4375 11.6416 7.24167 11.6416 7Z"
                           fill="currentColor"
                        />
                        <path
                           d="M10.9007 10.2832C10.7298 10.1123 10.4528 10.1123 10.282 10.2832C10.1111 10.454 10.1111 10.7311 10.282 10.9019L10.9103 11.5302C11.0811 11.7011 11.3581 11.7011 11.529 11.5302C11.6999 11.3594 11.6999 11.0823 11.529 10.9115L10.9007 10.2832Z"
                           fill="currentColor"
                        />
                        <path
                           d="M0.592285 7C0.592285 6.75838 0.788163 6.5625 1.02979 6.5625H1.91835C2.15998 6.5625 2.35585 6.75838 2.35585 7C2.35585 7.24162 2.15998 7.4375 1.91835 7.4375H1.02979C0.788163 7.4375 0.592285 7.24162 0.592285 7Z"
                           fill="currentColor"
                        />
                        <path
                           d="M3.08768 2.47018C2.91682 2.29933 2.63982 2.29933 2.46896 2.47018C2.29811 2.64103 2.29811 2.91805 2.46896 3.0889L3.09727 3.71721C3.26813 3.88807 3.54514 3.88807 3.71599 3.71721C3.88685 3.54635 3.88685 3.26935 3.71599 3.09849L3.08768 2.47018Z"
                           fill="currentColor"
                        />
                        <path
                           d="M4.52415 4.52513C5.89096 3.15829 8.10704 3.15829 9.47391 4.52513C10.8407 5.89196 10.8407 8.10804 9.47391 9.47485C8.10704 10.8417 5.89096 10.8417 4.52415 9.47485C3.15732 8.10804 3.15732 5.89196 4.52415 4.52513Z"
                           fill="currentColor"
                        />
                     </svg>
                  )}
               </Button>
            </div>
         </div>
      </aside>
   )
}
