import { Dialog as DialogPrimitive } from "@base-ui-components/react/dialog"
import { dialogStyles } from "../constants"
import { cn } from "../utils"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal
export const DialogBackdrop = DialogPrimitive.Backdrop

export function DialogPopup({
   className,
   children,
   ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
   return (
      <DialogPortal>
         <DialogBackdrop className={dialogStyles.backdrop} />
         <DialogPrimitive.Popup
            className={cn(
               dialogStyles.transition,
               dialogStyles.popup,
               className,
            )}
            {...props}
         >
            {children}
         </DialogPrimitive.Popup>
      </DialogPortal>
   )
}

export function DialogTitle({
   className,
   ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
   return (
      <DialogPrimitive.Title
         className={cn(dialogStyles.title, className)}
         {...props}
      />
   )
}

export function DialogDescription({
   className,
   ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
   return (
      <DialogPrimitive.Description
         className={cn(dialogStyles.description, className)}
         {...props}
      />
   )
}

export function DialogFooter({
   className,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(dialogStyles.footer, className)}
         {...props}
      />
   )
}
