import { hc, honoMutationFn, honoQueryFn } from "@/lib/hono"
import { Button } from "@project/ui/components/button"
import { Card } from "@project/ui/components/card"
import { Loading } from "@project/ui/components/loading"
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
   const query2 = useQuery(someQuery2({ id: "123" }))
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
      <Card className="mx-auto mt-20 flex w-full max-w-xl flex-col items-center gap-4">
         <p className="text-gray-11">
            {query.isPending
               ? "Loading..."
               : query.isError
                 ? `Error: ${query.error.code} ${query.error?.message}`
                 : query.data?.message}
         </p>

         <p>
            {query2.isPending
               ? "Loading..."
               : query2.isError
                 ? `Error: ${query2.error.code} ${query2.error?.message}`
                 : query2.data?.message.id}
         </p>

         <Button onClick={() => mutation.mutate({ someData: "some data" })}>
            {mutation.isPending ? (
               <>
                  <Loading />
                  posting..
               </>
            ) : (
               "post something"
            )}
         </Button>
         <Button variant="secondary">secondary button</Button>
         <Button variant="destructive">destructive button</Button>
         <Button variant="ghost">ghost button</Button>
      </Card>
   )
}
