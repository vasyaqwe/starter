import { api } from "@/api"
import { useCssVariable } from "@/interactions/use-css-variable"
import { Main } from "@/routes/-components/main"
import { trpc } from "@/trpc"
import { useAuth } from "@/user/hooks"
import { validator } from "@/validator"
import {
   decodeBase64,
   encodeBase64,
   encodeBase64urlNoPadding,
} from "@oslojs/encoding"
import { Button } from "@project/ui/components/button"
import {
   Dialog,
   DialogFooter,
   DialogPopup,
   DialogTitle,
} from "@project/ui/components/dialog"
import {
   Field,
   FieldControl,
   FieldError,
   FieldLabel,
} from "@project/ui/components/field"
import { Icons } from "@project/ui/components/icons"
import { Separator } from "@project/ui/components/separator"
import { Switch } from "@project/ui/components/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@project/ui/components/tabs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { toast } from "sonner"
import { z } from "zod"

const tabs = ["general", "preferences", "billing"] as const

export const Route = createFileRoute("/_layout/settings")({
   component: RouteComponent,
   validateSearch: validator(
      z.object({
         tab: z.enum(tabs).catch("general"),
      }),
   ),
   head: () => ({
      meta: [{ title: "Settings" }],
   }),
})

function BillingPanel() {
   const queryClient = useQueryClient()
   const query = useQuery(trpc.subscription.one.queryOptions())
   const subscription = query.data
   const subscribe = useMutation({
      mutationFn: async () => {
         window.location.href = api.billing.checkout.$url().toString()
      },
   })
   const cancel = useMutation({
      mutationFn: api.billing.cancel.$post,
      onSuccess: () => {
         toast("Canceled subscription")
         queryClient.invalidateQueries(trpc.subscription.one.queryOptions())
      },
   })

   return (
      <div className="py-6">
         <h2 className="font-semibold text-lg">Subscription</h2>
         <p className="mt-2 mb-6 text-foreground/70">
            Subscription is: {subscription?.status ?? "null"} <br />
            {subscription?.status === "canceled" ? (
               <>
                  Was canceled on{" "}
                  {new Date(
                     subscription.currentPeriodEnd ?? "",
                  ).toLocaleDateString()}
               </>
            ) : subscription?.cancelAtPeriodEnd ? (
               <>
                  Will be canceled on{" "}
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
         {subscription?.cancelAtPeriodEnd ? null : subscription?.status ===
           "active" ? (
            <Button
               isPending={cancel.isPending}
               disabled={cancel.isPending}
               onClick={() => cancel.mutate({})}
            >
               Cancel
            </Button>
         ) : (
            <Button onClick={() => subscribe.mutate()}>Subscribe</Button>
         )}
      </div>
   )
}

function RouteComponent() {
   const queryClient = useQueryClient()
   const search = Route.useSearch()
   const navigate = useNavigate()
   const [cursor, setCursor] = useCssVariable("cursor", "default")
   const auth = useAuth()
   const query = useQuery(trpc.passkey.list.queryOptions())

   const [createPasskeyOpen, setCreatePasskeyOpen] = React.useState(false)
   const [attestation, setAttestation] = React.useState("")
   const [clientData, setClientData] = React.useState("")

   const createChallenge = useMutation(
      trpc.passkey.createChallenge.mutationOptions({
         onSuccess: async (data) => {
            const challenge = decodeBase64(data.challenge)
            const credentialUserId = decodeBase64(data.credentialUserId)
            const credentialIds = data.credentialIds
               .split(",")
               .map((i) => decodeBase64(i))

            const credential = await navigator.credentials.create({
               publicKey: {
                  challenge,
                  user: {
                     displayName: auth.user.name,
                     id: credentialUserId,
                     name: auth.user.email,
                  },
                  rp: {
                     name: "Project",
                  },
                  pubKeyCredParams: [
                     {
                        alg: -7,
                        type: "public-key",
                     },
                     {
                        alg: -257,
                        type: "public-key",
                     },
                  ],
                  attestation: "none",
                  authenticatorSelection: {
                     userVerification: "required",
                     residentKey: "required",
                     requireResidentKey: true,
                  },
                  excludeCredentials: credentialIds
                     .filter((id) => id && id.length > 0) // Filter out empty or invalid IDs
                     .map((id) => ({
                        id,
                        type: "public-key",
                     })),
               },
            })

            if (!(credential instanceof PublicKeyCredential))
               throw new Error("Failed to create public key")
            if (
               !(
                  credential.response instanceof
                  AuthenticatorAttestationResponse
               )
            )
               throw new Error("Unexpected error")

            setAttestation(
               encodeBase64(
                  new Uint8Array(credential.response.attestationObject),
               ),
            )
            setClientData(
               encodeBase64(new Uint8Array(credential.response.clientDataJSON)),
            )
            setCreatePasskeyOpen(true)
         },
         onError: (error) => {
            if (error instanceof DOMException)
               return toast("Request was cancelled")
            toast.error(error.message)
         },
      }),
   )

   const create = useMutation(
      trpc.passkey.create.mutationOptions({
         onSuccess: () => {
            queryClient.invalidateQueries(trpc.passkey.list.queryOptions())
            setCreatePasskeyOpen(false)
            setTimeout(() => {
               create.reset()
            }, 100)
         },
      }),
   )

   const passkeys = query.data ?? []

   return (
      <Main>
         <Tabs
            value={search.tab}
            onValueChange={(tab) =>
               navigate({ to: ".", search: { tab }, replace: true })
            }
         >
            <div>
               <h1 className="font-semibold text-xl">Settings</h1>
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
                  <h2 className="font-semibold text-lg">Passkeys</h2>
                  <p className="mt-2 mb-4 text-foreground/70">
                     Manage your authentication passkeys here.
                  </p>
                  <Separator className={"mb-3"} />
                  {query.isPending ? null : query.isError ? (
                     <p className="text-destructive">
                        There was an error loading your passkeys.
                     </p>
                  ) : (
                     <ul className="space-y-0.5">
                        {passkeys.length === 0 ? (
                           <li className="text-foreground/75">
                              No passkeys added yet.
                           </li>
                        ) : (
                           passkeys.map((passkey) => {
                              const id = encodeBase64urlNoPadding(
                                 // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                 new Uint8Array((passkey.id as any).data),
                              )
                              return (
                                 <PasskeyItem
                                    name={passkey.name}
                                    id={id}
                                    key={id}
                                 />
                              )
                           })
                        )}
                     </ul>
                  )}
                  <Button
                     className="mt-5"
                     disabled={createChallenge.isPending}
                     onClick={() => createChallenge.mutate()}
                  >
                     {createChallenge.isPending ? (
                        "Confirm passkey.."
                     ) : (
                        <>
                           <Icons.plus className="size-5" /> New passkey
                        </>
                     )}
                  </Button>
                  <Dialog
                     open={createPasskeyOpen}
                     onOpenChange={setCreatePasskeyOpen}
                  >
                     <DialogPopup
                        className={"w-80"}
                        render={
                           <form
                              onSubmit={(e) => {
                                 e.preventDefault()
                                 const { name } = Object.fromEntries(
                                    new FormData(
                                       e.target as HTMLFormElement,
                                    ).entries(),
                                 ) as { name: string }

                                 create.mutate({
                                    name,
                                    attestation,
                                    clientData,
                                 })
                              }}
                           />
                        }
                     >
                        <DialogTitle>Create your passkey</DialogTitle>
                        <Field className={"mt-2"}>
                           <FieldLabel>Name</FieldLabel>
                           <FieldControl
                              required
                              name="name"
                              placeholder="my-passkey"
                           />
                           <FieldError match="valueMissing">
                              Name is required
                           </FieldError>
                        </Field>
                        <DialogFooter>
                           <Button
                              className="w-full"
                              isPending={create.isPending || create.isSuccess}
                              disabled={create.isPending || create.isSuccess}
                           >
                              Confirm
                           </Button>
                        </DialogFooter>
                     </DialogPopup>
                  </Dialog>
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
               <BillingPanel />
            </TabsPanel>
         </Tabs>
      </Main>
   )
}

function PasskeyItem({ name, id }: { name: string; id: string }) {
   const queryClient = useQueryClient()
   const deletePasskey = useMutation(
      trpc.passkey.delete.mutationOptions({
         onSuccess: () => {
            queryClient.invalidateQueries(trpc.passkey.list.queryOptions())
         },
      }),
   )

   return (
      <li className="flex items-center">
         <span className="line-clamp-1">{name}</span>
         <Button
            className="ml-auto"
            variant={"ghost"}
            kind={"icon"}
            size={"sm"}
            disabled={deletePasskey.isPending || deletePasskey.isSuccess}
            aria-label={`Delete passkey ${name}`}
            onClick={() =>
               deletePasskey.mutate({
                  id,
               })
            }
         >
            <Icons.trash className="size-5 md:size-[18px]" />
         </Button>
      </li>
   )
}
