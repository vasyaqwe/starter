import { hc, honoMutationFn, honoQueryFn } from "@/lib/hono"
import { Button } from "@project/ui/components/button"
import { Card } from "@project/ui/components/card"
import { Loading } from "@project/ui/components/loading"
import { ScrollArea } from "@project/ui/components/scroll-area"
import {
   Select,
   SelectItem,
   SelectPopup,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
} from "@project/ui/components/select"
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
         window.alert(data.message.someData)
      },
      onError: (error) => {
         window.alert(`${error.code} ${error.message}`)
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

            <Button onClick={() => mutation.mutate({ someData: "some data" })}>
               {mutation.isPending ? (
                  <>
                     <Loading />
                     loading..
                  </>
               ) : (
                  "primary button"
               )}
            </Button>
            <Button variant="secondary">secondary button</Button>
            <Button variant="destructive">destructive button</Button>
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
