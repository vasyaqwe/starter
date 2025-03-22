import { sendNotification } from "@/notification/utils"
import {
   AlertDialog,
   AlertDialogClose,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogPopup,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@project/ui/components/alert-dialog"
import { Button, buttonVariants } from "@project/ui/components/button"
import { Card } from "@project/ui/components/card"
import {
   Dialog,
   DialogClose,
   DialogDescription,
   DialogFooter,
   DialogPopup,
   DialogTitle,
   DialogTrigger,
} from "@project/ui/components/dialog"
import { ScrollArea } from "@project/ui/components/scroll-area"
import {
   Select,
   SelectItem,
   SelectPopup,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
} from "@project/ui/components/select"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <ScrollArea className={"p-4 md:p-6"}>
         <Card className="flex w-full max-w-xl flex-wrap gap-4 p-6">
            <Button>primary button</Button>
            <Dialog>
               <DialogTrigger
                  className={buttonVariants({ variant: "secondary" })}
               >
                  secondary button
               </DialogTrigger>
               <DialogPopup>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>
                     You are all caught up. Good job!
                  </DialogDescription>
                  <DialogFooter>
                     <DialogClose
                        className={buttonVariants({ variant: "secondary" })}
                     >
                        close
                     </DialogClose>
                  </DialogFooter>
               </DialogPopup>
            </Dialog>
            <AlertDialog>
               <AlertDialogTrigger
                  className={buttonVariants({ variant: "destructive" })}
               >
                  destructive button
               </AlertDialogTrigger>
               <AlertDialogPopup>
                  <AlertDialogTitle>Delete something?</AlertDialogTitle>
                  <AlertDialogDescription>
                     You can’t undo this action.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                     <AlertDialogClose
                        className={buttonVariants({ variant: "secondary" })}
                     >
                        cancel
                     </AlertDialogClose>
                     <AlertDialogClose
                        className={buttonVariants({ variant: "destructive" })}
                     >
                        delete
                     </AlertDialogClose>
                  </AlertDialogFooter>
               </AlertDialogPopup>
            </AlertDialog>
            <Button
               onClick={() =>
                  sendNotification({
                     title: "Notification title",
                     body: "This is a test notification",
                  })
               }
               variant="ghost"
            >
               ghost button
            </Button>
            <Select defaultValue="sans">
               <SelectTrigger className={"min-w-[150px]"}>
                  <SelectValue placeholder="Sans-serif" />
               </SelectTrigger>
               <SelectPopup side="top">
                  <SelectItem value="sans">Sans</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="cursive">Cursive</SelectItem>
               </SelectPopup>
            </Select>
         </Card>
      </ScrollArea>
   )
}
