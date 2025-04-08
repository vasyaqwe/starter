import { useSetAtom } from "jotai"
import * as React from "react"
import { fileTriggerOpenAtom } from "../store"
import { Button } from "./button"
import { Icons } from "./icons"
import { Kbd } from "./kbd"

export const FILE_TRIGGER_HOTKEY = "mod+shift+f"

interface Props extends Omit<React.ComponentProps<typeof Button>, "onChange"> {
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
   multiple?: boolean
}

export function FileTrigger({
   children,
   onClick,
   onChange,
   multiple = true,
   ...props
}: Props) {
   const setFileTriggerOpen = useSetAtom(fileTriggerOpenAtom)
   const inputRef = React.useRef<HTMLInputElement>(null)

   return (
      <Button
         aria-label="Add files"
         {...props}
         onClick={(e) => {
            setFileTriggerOpen(true)
            inputRef?.current?.click()
            onClick?.(e)
         }}
      >
         <input
            type="file"
            hidden
            ref={inputRef}
            multiple={multiple}
            onChange={(e) => {
               onChange(e)
               setFileTriggerOpen(false)
            }}
         />
         {children}
      </Button>
   )
}

export function FileTriggerTooltipContent() {
   return (
      <>
         Add files
         <Kbd className="ml-1">Ctrl</Kbd>
         <Kbd className="py-0">
            <Icons.shift className="h-5 w-[18px]" />
         </Kbd>
         <Kbd>F</Kbd>
      </>
   )
}
