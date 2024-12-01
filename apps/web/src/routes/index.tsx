import { type InferRequestInput, hc } from "@/lib/hono"
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
   component: RouteComponent,
})

function RouteComponent() {
   const someQuery = () =>
      queryOptions({
         queryKey: ["query"],
         queryFn: async () => {
            const res = await hc.hello.$get()
            return res.ok ? res.json() : Promise.reject(await res.json())
         },
      })

   const query = useQuery(someQuery())
   const mutation = useMutation({
      mutationFn: async (data: InferRequestInput<typeof hc.post.$post>) => {
         const res = await hc.post.$post(data)
         return res.ok ? res.json() : Promise.reject(await res.json())
      },
      onSuccess: async (data) => {
         window.alert(data.message.someData)
      },
   })

   return (
      <>
         <p>
            {query.isPending
               ? "Loading..."
               : query.isError
                 ? `Error: ${query.error.code} ${query.error?.message}`
                 : query.data?.message}
         </p>

         <button
            className="cursor-pointer hover:underline"
            onClick={() =>
               mutation.mutate({ json: { someData: "some data here" } })
            }
         >
            post something
         </button>
      </>
   )
}
