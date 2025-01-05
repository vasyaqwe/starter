import { subscriptionByUserIdQuery } from "@/billing/queries"
import { useCssVariable } from "@/interactions/use-css-variable"
import { hc, honoMutationFn } from "@/lib/hono"
import { Button } from "@project/ui/components/button"
import { ScrollArea } from "@project/ui/components/scroll-area"
import { Switch } from "@project/ui/components/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@project/ui/components/tabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { toast } from "sonner"
import { z } from "zod"

const tabs = ["general", "preferences", "billing"] as const

export const Route = createFileRoute("/_layout/settings")({
   component: RouteComponent,
   validateSearch: zodValidator(
      z.object({
         tab: z.enum(tabs).catch("general"),
      }),
   ),
   // loaderDeps: ({ search }) => ({ search }),
})

function RouteComponent() {
   const queryClient = useQueryClient()
   const search = Route.useSearch()
   const navigate = useNavigate()
   const [cursor, setCursor] = useCssVariable("cursor", "default")

   const query = useQuery(
      subscriptionByUserIdQuery({ enabled: search.tab === "billing" }),
   )
   const subscription = query.data
   const subscribeMutation = useMutation({
      mutationFn: async () => {
         window.location.href = hc.billing.checkout.$url().toString()
      },
   })
   const cancelMutation = useMutation({
      mutationFn: async () => honoMutationFn(await hc.billing.cancel.$post()),
      onSuccess: () => {
         toast("Canceled subscription")
         queryClient.invalidateQueries(subscriptionByUserIdQuery())
      },
   })

   return (
      <>
         <ScrollArea className={"mx-auto w-full max-w-2xl p-4 md:p-6"}>
            <Tabs
               value={search.tab}
               onValueChange={(tab) =>
                  navigate({ to: ".", search: { tab }, replace: true })
               }
            >
               <div>
                  <h1 className="font-bold text-xl">Settings</h1>
                  <p className="mt-1 mb-6 text-foreground/75">
                     View and manage your workspace settings.
                  </p>
                  <TabsList>
                     {tabs.map((tab) => (
                        <TabsTab
                           className={"capitalize"}
                           key={tab}
                           value={tab}
                        >
                           {tab}
                        </TabsTab>
                     ))}
                  </TabsList>
               </div>
               <TabsPanel
                  value={"general"}
                  className={"divide-y divide-primary-4"}
               >
                  <div className="py-6">
                     <h2 className="font-semibold text-lg">Some setting</h2>
                     <p className="mt-2 mb-6 text-foreground/70">
                        Do this setting to do something.
                     </p>
                  </div>
               </TabsPanel>
               <TabsPanel
                  value={"preferences"}
                  className={"divide-y divide-primary-4"}
               >
                  <div className="py-6">
                     <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">
                           Use pointer cursors
                        </h2>
                        <Switch
                           checked={cursor === "pointer"}
                           onCheckedChange={() =>
                              setCursor(
                                 cursor === "pointer" ? "default" : "pointer",
                              )
                           }
                        />
                     </div>
                     <p className="mt-2 mb-6 text-foreground/70">
                        Change the cursor to pointer when hovering over any
                        interactive elements.
                     </p>
                  </div>
               </TabsPanel>
               <TabsPanel
                  value={"billing"}
                  className={"divide-y divide-primary-4"}
               >
                  <div className="py-6">
                     <h2 className="font-semibold text-lg">Subscription</h2>
                     <p className="mt-2 mb-6 text-foreground/70">
                        Subscription is: {subscription?.status ?? "null"} <br />
                        {subscription?.cancelAtPeriodEnd ? (
                           <>
                              Will be cancled on{" "}
                              {new Date(
                                 subscription.currentPeriodEnd ?? "",
                              ).toLocaleDateString()}
                           </>
                        ) : subscription?.currentPeriodEnd ? (
                           <>
                              Next payment on:{" "}
                              {new Date(
                                 subscription.currentPeriodEnd ?? "",
                              ).toLocaleDateString()}
                           </>
                        ) : null}
                     </p>
                     {subscription?.status === "canceled" ||
                     subscription?.cancelAtPeriodEnd ? (
                        <Button onClick={() => subscribeMutation.mutate()}>
                           Renew
                        </Button>
                     ) : subscription?.status === "active" ? (
                        <Button
                           isPending={cancelMutation.isPending}
                           disabled={cancelMutation.isPending}
                           onClick={() => cancelMutation.mutate()}
                        >
                           Cancel
                        </Button>
                     ) : (
                        <Button onClick={() => subscribeMutation.mutate()}>
                           Subscribe
                        </Button>
                     )}
                  </div>
               </TabsPanel>
            </Tabs>
         </ScrollArea>
      </>
   )
}
