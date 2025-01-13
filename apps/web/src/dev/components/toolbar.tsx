import { FLAGS } from "@/dev/constants"
import { flagsAtom } from "@/dev/store"
import { Button } from "@project/ui/components/button"
import {
   Menu,
   MenuCheckboxItem,
   MenuGroup,
   MenuGroupLabel,
   MenuPopup,
   MenuTrigger,
} from "@project/ui/components/menu"
import { popupStyles } from "@project/ui/constants"
import { cn } from "@project/ui/utils"
import { useAtom } from "jotai"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"

export function Toolbar() {
   const [flags, setFlags] = useAtom(flagsAtom)
   const [visible, setVisible] = React.useState(true)

   useHotkeys("t", (e) => {
      e.preventDefault()
      setVisible((prev) => !prev)
   })

   return (
      <div
         data-visible={visible ? "" : undefined}
         className={cn(
            popupStyles.base,
            "-translate-x-1/2 fixed bottom-5 left-1/2 z-[2] flex animate-slide-up items-center rounded-full p-1",
            "translate-y-20 scale-75 blur-[0.4rem] transition-all duration-500 ease-vaul data-[visible]:translate-y-0 data-[visible]:scale-100 data-[visible]:blur-none",
         )}
      >
         <Menu>
            <MenuTrigger
               render={
                  <Button
                     variant={"menu-item"}
                     size={"icon"}
                     className="rounded-full"
                  >
                     <svg
                        className="!text-white size-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                     >
                        <g fill="currentColor">
                           <path
                              fill="currentColor"
                              d="M3.1,5.3C2.8,4.8,2.2,4.6,1.8,4.9C1.3,5.2,1.1,5.8,1.4,6.3l9.5,16.5c0.2,0.3,0.5,0.5,0.9,0.5 c0.2,0,0.3,0,0.5-0.1c0.5-0.3,0.6-0.9,0.4-1.4L3.1,5.3z"
                           />
                           <path
                              fill="currentColor"
                              d="M22.6,9l-4.5-7.8C18,1,17.7,0.8,17.4,0.8c-0.3,0-0.6,0-0.8,0.3c-1.3,1.2-2.8,1.3-4.3,1.3l-1.1,0 c-2,0-4.2,0.2-5.9,2.7l5.6,9.6c0.2-0.1,0.3-0.2,0.4-0.4c1.2-2.1,2.6-2.2,4.5-2.2l1,0c1.8,0,3.8-0.1,5.7-1.8C22.8,10,22.8,9.5,22.6,9 z"
                           />
                        </g>
                     </svg>
                  </Button>
               }
            />
            <MenuPopup>
               <MenuGroup>
                  <MenuGroupLabel>Feature flags</MenuGroupLabel>
                  {FLAGS.map((flag) => (
                     <MenuCheckboxItem
                        key={flag}
                        checked={flags[flag]}
                        onCheckedChange={() =>
                           setFlags((prev) => ({
                              ...prev,
                              [flag]: !prev[flag],
                           }))
                        }
                     >
                        {flag}
                     </MenuCheckboxItem>
                  ))}
               </MenuGroup>
            </MenuPopup>
         </Menu>
      </div>
   )
}
