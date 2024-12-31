import { AlertDialog as AlertDialogPrimitive } from "@base-ui-components/react/alert-dialog"
import { dialogStyles } from "../constants"
import { cn } from "../utils"

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogClose = AlertDialogPrimitive.Close
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogBackdrop = AlertDialogPrimitive.Backdrop

export function AlertDialogPopup({
   className,
   children,
   ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Popup>) {
   return (
      <AlertDialogPortal>
         <AlertDialogBackdrop className={dialogStyles.backdrop} />
         <AlertDialogPrimitive.Popup
            className={cn(
               dialogStyles.transition,
               dialogStyles.popup,
               className,
            )}
            {...props}
         >
            {children}
         </AlertDialogPrimitive.Popup>
      </AlertDialogPortal>
   )
}

export function AlertDialogTitle({
   className,
   ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
   return (
      <AlertDialogPrimitive.Title
         className={cn(dialogStyles.title, className)}
         {...props}
      />
   )
}

export function AlertDialogDescription({
   className,
   ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
   return (
      <AlertDialogPrimitive.Description
         className={cn(dialogStyles.description, className)}
         {...props}
      />
   )
}

export function AlertDialogFooter({
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
