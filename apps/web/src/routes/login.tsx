import { useCountdownTimer } from "@/interactions/use-timer"
import { hc, honoMutationFn } from "@/lib/hono"
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
import { Loading } from "@project/ui/components/loading"
import { toast } from "@project/ui/components/toast"
import { MOBILE_BREAKPOINT } from "@project/ui/constants"
import { cn } from "@project/ui/utils"
import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import type { InferRequestType } from "hono"
import * as React from "react"
import { z } from "zod"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
   validateSearch: zodValidator(
      z.object({
         otp: z.boolean().catch(false),
         email: z.string().catch(""),
      }),
   ),
})

function RouteComponent() {
   const { otp, email } = Route.useSearch()
   const navigate = useNavigate()

   const otpInputRef = React.useRef<HTMLInputElement>(null)
   const timer = useCountdownTimer({
      initialTime: 45,
   })

   const sendLoginCode = useMutation({
      mutationFn: async (
         data: InferRequestType<
            (typeof hc.api.auth)["send-login-otp"]["$post"]
         >["json"],
      ) =>
         honoMutationFn(
            await hc.api.auth["send-login-otp"].$post({ json: data }),
         ),
      onMutate: () => {
         timer.start()
      },
      onSuccess: ({ email }) => {
         navigate({ to: ".", search: { otp: true, email } }).then(() =>
            otpInputRef.current?.focus(),
         )
      },
      onError: () => {
         toast.error("An error occurred, couldn't send code")
         timer.reset()
      },
   })

   const verifyLoginCode = useMutation({
      mutationFn: async (
         data: InferRequestType<
            (typeof hc.api.auth)["verify-login-otp"]["$post"]
         >["json"],
      ) =>
         honoMutationFn(
            await hc.api.auth["verify-login-otp"].$post({ json: data }),
         ),
      onError: () => undefined,
      onSuccess: () => {
         setTimeout(() => {
            toast.dismiss()
            navigate({ to: "/" })
         }, 500)
      },
   })

   const onVerifyCode = ({ code }: { code: string }) => {
      toast.dismiss("otp")
      toast.promise(verifyLoginCode.mutateAsync({ code, email }), {
         id: "otp",
         loading: "Verifying code...",
         success: () => `Code is valid`,
         error: () => `Code is invalid or expired`,
         position:
            window.innerWidth < MOBILE_BREAKPOINT
               ? "top-center"
               : "bottom-center",
      })
   }

   return (
      <>
         <Link
            to="/"
            className={cn(
               buttonVariants({ variant: "ghost", size: "icon" }),
               "absolute top-3 left-3 cursor-pointer",
            )}
            aria-label="Go back"
         >
            <Icons.arrowLeft className="size-5" />
         </Link>
         <main className="grid h-svh w-full place-items-center">
            <div className="-mt-16 relative w-full max-w-[22rem]">
               <AnimatedStack activeIndex={otp ? 1 : 0}>
                  <Card className="relative">
                     <h1 className="-mt-1.5 mb-4 font-semibold text-xl">
                        Sign in to your account
                     </h1>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault()
                           const formData = Object.fromEntries(
                              new FormData(
                                 e.target as HTMLFormElement,
                              ).entries(),
                           ) as { email: string }
                           sendLoginCode.mutate({
                              email: formData.email,
                           })
                        }}
                     >
                        <Field>
                           <FieldLabel>Email</FieldLabel>
                           <FieldControl
                              defaultValue={email}
                              type="email"
                              name="email"
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
                        <Button
                           className="mt-5 w-full"
                           disabled={
                              sendLoginCode.isPending || sendLoginCode.isSuccess
                           }
                        >
                           {sendLoginCode.isPending ||
                           sendLoginCode.isSuccess ? (
                              <Loading />
                           ) : (
                              "Continue"
                           )}
                        </Button>
                     </form>
                  </Card>
                  <Card>
                     <Link
                        aria-label="Go back"
                        to="."
                        search={{ otp: false, email }}
                        onClick={() => sendLoginCode.reset()}
                        className={cn(
                           buttonVariants({
                              size: "icon",
                              variant: "ghost",
                           }),
                           "absolute top-2 left-2 z-[2] text-foreground/90",
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
                           <p className="mt-7 mb-5 text-center font-medium text-lg">
                              Enter the code sent to your email
                           </p>
                           <InputOTP
                              key={otp.toString()}
                              disabled={verifyLoginCode.isSuccess}
                              ref={otpInputRef}
                              containerClassName={
                                 !otp
                                    ? "[&>div>input]:!pointer-events-none"
                                    : ""
                              }
                              maxLength={6}
                              onComplete={(code) => {
                                 if (verifyLoginCode.isPending) return

                                 // blur on mobile for toast to be visible
                                 if (window.innerWidth < MOBILE_BREAKPOINT) {
                                    otpInputRef.current?.blur()
                                 }

                                 onVerifyCode({ code })
                              }}
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
                           <p className="mt-7 text-center text-foreground/70 leading-relaxed">
                              The code expires in 5 minutes. <br /> Trouble?{" "}
                              <button
                                 disabled={timer.timeLeft > 0}
                                 onClick={() => {
                                    sendLoginCode.mutate({
                                       email,
                                    })
                                 }}
                                 className="ml-0.5 cursor-pointer underline enabled:hover:text-foreground/90 disabled:cursor-not-allowed"
                              >
                                 Resend code{" "}
                                 {timer.timeLeft > 0
                                    ? `(${timer.timeLeft})`
                                    : null}
                              </button>
                           </p>
                        </>
                     </form>
                  </Card>
               </AnimatedStack>
            </div>
         </main>
      </>
   )
}
