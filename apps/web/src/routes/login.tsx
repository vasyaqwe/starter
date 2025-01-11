import { useMountError } from "@/interactions/use-mount-error"
import { useCountdownTimer } from "@/interactions/use-timer"
import { hc, honoMutationFn } from "@/lib/hono"
import { isNative } from "@/ui/constants"
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
import { Separator } from "@project/ui/components/separator"
import { toast } from "@project/ui/components/toast"
import { MOBILE_BREAKPOINT } from "@project/ui/constants"
import { cn } from "@project/ui/utils"
import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"
import { open } from "@tauri-apps/plugin-shell"
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

let isMounted = false

function RouteComponent() {
   useMountError("Login failed, please try again")

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
      onError: (error) => {
         toast.error(error.message)
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
         navigate({ to: "/" })
         setTimeout(() => {
            toast.dismiss()
         }, 1000)
      },
   })

   const onVerifyCode = ({ code }: { code: string }) => {
      toast.promise(verifyLoginCode.mutateAsync({ code, email }), {
         id: "otp",
         loading: "Verifying code...",
         success: () => "Code is valid",
         error: (error: unknown) =>
            error instanceof Error
               ? error.message
               : "Code is invalid or expired",
         position:
            window.innerWidth < MOBILE_BREAKPOINT
               ? "top-center"
               : "bottom-center",
      })
   }

   const loginWithGoogle = useMutation({
      mutationFn: async () => {
         const url = hc.api.auth[":provider"]
            .$url({
               param: { provider: "google" },
               query: {
                  redirect: isNative ? "project://auth/callback" : undefined,
               },
            })
            .toString()

         if (isNative) {
            open(url)
         } else {
            window.location.href = url
         }
      },
   })

   React.useEffect(() => {
      if (isMounted) return

      const init = async () => {
         try {
            await onOpenUrl(async ([urlString]) => {
               const url = new URL(urlString ?? "")
               if (url.toString().includes("finish-auth")) {
                  const state = url.searchParams.get("state") ?? ""
                  const code = url.searchParams.get("code") ?? ""
                  const code_verifier =
                     url.searchParams.get("code_verifier") ?? ""

                  const res = await hc.api.auth[":provider"].callback.$get({
                     param: { provider: "google" },
                     query: { client: "native", code, state, code_verifier },
                  })
                  if (!res.ok) {
                     loginWithGoogle.reset()
                     return toast.error("Login failed, please try again")
                  }

                  navigate({ to: "/" })
               }
            })
         } catch (err) {
            console.error(err)
         }
      }
      init()
      isMounted = true
   }, [])

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
                  <Card className="relative p-6">
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
                           isPending={
                              sendLoginCode.isPending || sendLoginCode.isSuccess
                           }
                           disabled={
                              sendLoginCode.isPending || sendLoginCode.isSuccess
                           }
                        >
                           Continue
                        </Button>
                     </form>
                     <span className="my-4 flex items-center justify-center gap-1.5 text-foreground/70">
                        <Separator className="flex-1 bg-primary-5" />
                        or
                        <Separator className="flex-1 bg-primary-5" />
                     </span>
                     <Button
                        isPending={
                           loginWithGoogle.isPending ||
                           loginWithGoogle.isSuccess
                        }
                        disabled={
                           loginWithGoogle.isPending ||
                           loginWithGoogle.isSuccess
                        }
                        onClick={() => loginWithGoogle.mutate()}
                        variant={"secondary"}
                        className="w-full"
                     >
                        <svg
                           className="size-4"
                           viewBox="0 0 24 24"
                        >
                           <path
                              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                              fill="#EA4335"
                           />
                           <path
                              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                              fill="#4285F4"
                           />
                           <path
                              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                              fill="#FBBC05"
                           />
                           <path
                              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                              fill="#34A853"
                           />
                        </svg>
                        Continue with Google
                     </Button>
                  </Card>
                  <Card className="p-6">
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
                           <p className="my-7 text-center font-medium text-lg">
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
