import { Button } from "@project/ui/components/button"
import { Card } from "@project/ui/components/card"
import {
   Field,
   FieldControl,
   FieldDescription,
   FieldError,
   FieldLabel,
} from "@project/ui/components/field"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <main className="grid h-svh w-full place-items-center">
            <Card className="-mt-16 w-full max-w-[22rem]">
               <h1 className="-mt-1.5 mb-4 font-semibold text-xl">
                  Sign in to your account
               </h1>
               <form
                  onSubmit={(e) => {
                     e.preventDefault()
                  }}
               >
                  <Field>
                     <FieldLabel>Email</FieldLabel>
                     <FieldControl
                        type="email"
                        required
                        placeholder="example@mail.com"
                     />
                     <FieldError match="valueMissing">
                        Please enter a valid email
                     </FieldError>

                     <FieldDescription>
                        We'll send you a one-time password.
                     </FieldDescription>
                  </Field>
                  <Button className="mt-5 w-full">Continue</Button>
               </form>
            </Card>
         </main>
      </>
   )
}
