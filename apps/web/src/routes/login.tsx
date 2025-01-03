import { AnimatedStack } from "@project/ui/components/animated-stack"
import { Button, buttonVariants } from "@project/ui/components/button"
import { Card } from "@project/ui/components/card"
import {
   Field,
   FieldControl,
   FieldDescription,
   FieldError,
   FieldLabel,
} from "@project/ui/components/field"
import { Icons } from "@project/ui/components/icons"
import { InputOTP, InputOTPSlot } from "@project/ui/components/input-otp"
import { cn } from "@project/ui/utils"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
   validateSearch: (search: Record<string, unknown>) =>
      ({
         otp: (search.otp as boolean) ?? false,
      }) as { otp?: boolean },
})

function RouteComponent() {
   const search = Route.useSearch()
   const navigate = useNavigate()

   return (
      <>
         <main className="grid h-svh w-full place-items-center">
            <div className="-mt-16 relative w-full max-w-[22rem]">
               <AnimatedStack activeIndex={search.otp ? 1 : 0}>
                  <Card className="relative">
                     <h1 className="-mt-1.5 mb-4 font-semibold text-xl">
                        Sign in to your account
                     </h1>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault()
                           navigate({ to: ".", search: { otp: true } })
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
                  <Card>
                     <Link
                        aria-label="Go back"
                        to="."
                        search={{ otp: false }}
                        className={cn(
                           buttonVariants({
                              size: "icon",
                              variant: "ghost",
                           }),
                           "absolute top-2 left-2 z-[2]",
                        )}
                     >
                        <Icons.arrowLeft className="size-5" />
                     </Link>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault()
                        }}
                     >
                        <>
                           <p className="mt-6 font-medium text-sm">
                              Enter the code sent to your email
                           </p>
                           <InputOTP
                              containerClassName={
                                 !search.otp
                                    ? "[&>div>input]:!pointer-events-none"
                                    : ""
                              }
                              maxLength={6}
                           >
                              <>
                                 <InputOTPSlot index={0} />
                                 <InputOTPSlot index={1} />
                                 <InputOTPSlot index={2} />
                                 <InputOTPSlot index={3} />
                                 <InputOTPSlot index={4} />
                                 <InputOTPSlot index={5} />
                              </>
                           </InputOTP>
                        </>
                     </form>
                  </Card>
               </AnimatedStack>
            </div>
         </main>
      </>
   )
}
