import { type InferRequestInput, handleHonoResponse, hc } from "@/lib/hono"
import { Button } from "@project/ui/components/button"
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
   component: RouteComponent,
})

const someQuery = () =>
   queryOptions({
      queryKey: ["query"],
      queryFn: async () => handleHonoResponse(await hc.api.hello.$get()),
   })
const someQuery2 = ({ id }: { id: string }) =>
   queryOptions({
      queryKey: ["query2", id],
      queryFn: async () =>
         handleHonoResponse(await hc.post[":id"].$get({ param: { id } })),
   })

function RouteComponent() {
   const query = useQuery(someQuery())
   const query2 = useQuery(someQuery2({ id: "123" }))
   const mutation = useMutation({
      mutationFn: async (data: InferRequestInput<typeof hc.post.$post>) =>
         handleHonoResponse(await hc.post.$post(data)),
      onSuccess: async (data) => {
         window.alert(data.message.someData)
      },
   })

   return (
      <div className="mt-20 flex flex-col items-center gap-4">
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

         <Button
            onClick={() =>
               mutation.mutate({ json: { someData: "some data here" } })
            }
         >
            post something
         </Button>
         <Button variant="secondary">secondary button</Button>
         <Button variant="destructive">destructive button</Button>
         <Button variant="ghost">ghost button</Button>
      </div>
   )
}
