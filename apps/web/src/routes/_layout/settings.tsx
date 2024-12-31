import { useCssVariable } from "@/interactions/use-css-variable"
import { ScrollArea } from "@project/ui/components/scroll-area"
import { Switch } from "@project/ui/components/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@project/ui/components/tabs"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/settings")({
   component: RouteComponent,
   validateSearch: (
      search: Record<string, unknown>,
   ): { tab: "general" | "preferences" } => ({
      tab: (search.tab as never) ?? "general",
   }),
})

function RouteComponent() {
   const search = Route.useSearch()
   const navigate = useNavigate()
   const [cursor, setCursor] = useCssVariable("cursor", "default")

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
                     <TabsTab value={"general"}>General</TabsTab>
                     <TabsTab value={"preferences"}>Preferences</TabsTab>
                  </TabsList>
               </div>
               <TabsPanel
                  value={"general"}
                  className={"divide-y divide-gray-4"}
               >
                  <div className="py-6">
                     <h2 className="font-semibold text-lg">Some setting</h2>
                     <p className="mt-2 mb-6 text-foreground/70 text-sm">
                        Do this setting to do something.
                     </p>
                  </div>
               </TabsPanel>
               <TabsPanel
                  value={"preferences"}
                  className={"divide-y divide-gray-4"}
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
                     <p className="mt-2 mb-6 text-foreground/70 text-sm">
                        Change the cursor to pointer when hovering over any
                        interactive elements.
                     </p>
                  </div>
               </TabsPanel>
            </Tabs>
         </ScrollArea>
      </>
   )
}
