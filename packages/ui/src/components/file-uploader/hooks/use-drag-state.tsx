import { getCurrentWebview } from "@tauri-apps/api/webview"
import * as React from "react"
import { isNative } from "../../../constants"
import { useEventListener } from "./use-event-listener"

export function useDragState() {
   const [isDragging, setIsDragging] = React.useState(false)

   // Handle Tauri native events
   React.useEffect(() => {
      if (!isNative) return

      let unlisten: (() => void) | null = null

      getCurrentWebview()
         .onDragDropEvent((event) => {
            if (event.payload.type === "over") {
               setIsDragging(true)
            } else if (
               event.payload.type === "drop" ||
               event.payload.type === "leave"
            ) {
               setIsDragging(false)
            }
         })
         .then((disposer) => {
            unlisten = disposer
         })

      return () => {
         unlisten?.()
      }
   }, [isNative])

   useEventListener("dragenter", (e) => {
      if (isNative) return
      e.preventDefault()
      setIsDragging(true)
   })
   useEventListener("dragleave", (e) => {
      if (isNative) return
      e.preventDefault()
      if (e.relatedTarget === null) setIsDragging(false)
   })
   useEventListener("drop", () => {
      if (isNative) return
      setIsDragging(false)
   })

   return { isDragging }
}
