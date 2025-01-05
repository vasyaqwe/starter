import { hc, honoMutationFn, honoQueryFn } from "@/lib/hono"
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
import { toast } from "@project/ui/components/toast"
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { InferRequestType } from "hono"

export const Route = createFileRoute("/_layout/")({
   component: RouteComponent,
})

const someQuery = () =>
   queryOptions({
      queryKey: ["query"],
      queryFn: honoQueryFn(() => hc.api.hello.$get()),
   })
const someQuery2 = ({ id }: { id: string }) =>
   queryOptions({
      queryKey: ["query2", id],
      queryFn: honoQueryFn(() => hc.post[":id"].$get({ param: { id } })),
   })

function RouteComponent() {
   const query = useQuery(someQuery())
   const _query2 = useQuery(someQuery2({ id: "123" }))
   const mutation = useMutation({
      mutationFn: async (
         data: InferRequestType<typeof hc.post.$post>["json"],
      ) => honoMutationFn(await hc.post.$post({ json: data })),
      onSuccess: (data) => {
         toast(data.message.someData)
      },
      onError: (error) => {
         toast.error(`${error.code} ${error.message}`)
      },
   })

   return (
      <ScrollArea className={"p-4 md:p-6"}>
         <Card className="flex w-full max-w-xl flex-wrap gap-4">
            <p className="text-primary-11">
               {query.isPending
                  ? "Loading..."
                  : query.isError
                    ? `Error: ${query.error.code} ${query.error?.message}`
                    : query.data?.message}
            </p>

            {/* <p>
               {query2.isPending
                  ? "Loading..."
                  : query2.isError
                    ? `Error: ${query2.error.code} ${query2.error?.message}`
                    : query2.data?.message.id}
            </p> */}

            <Button
               isPending={mutation.isPending}
               onClick={() => mutation.mutate({ someData: "some data" })}
            >
               primary button
            </Button>
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
            <Button variant="ghost">ghost button</Button>
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
