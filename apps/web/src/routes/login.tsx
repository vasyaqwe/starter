import { useMountError } from "@/interactions/use-mount-error"
import { useCountdownTimer } from "@/interactions/use-timer"
import { hc, honoMutationFn } from "@/lib/hono"
import { decodeBase64, encodeBase64 } from "@oslojs/encoding"
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
import { isNative } from "@project/ui/constants"
import { isMobileAtom } from "@project/ui/store"
import { cn } from "@project/ui/utils"
import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { onOpenUrl } from "@tauri-apps/plugin-deep-link"
import { open } from "@tauri-apps/plugin-shell"
import type { InferRequestType } from "hono"
import { useAtomValue } from "jotai"
import * as React from "react"
import { toast } from "sonner"
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

                  const res = await hc.auth[":provider"].callback.$get({
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

   const isMobile = useAtomValue(isMobileAtom)

   const { otp, email } = Route.useSearch()
   const navigate = useNavigate()

   const otpInputRef = React.useRef<HTMLInputElement>(null)
   const timer = useCountdownTimer({
      initialTime: 45,
   })

   const sendLoginCode = useMutation({
      mutationFn: async (
         data: InferRequestType<
            (typeof hc.auth)["send-login-otp"]["$post"]
         >["json"],
      ) =>
         honoMutationFn(await hc.auth["send-login-otp"].$post({ json: data })),
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
            (typeof hc.auth)["verify-login-otp"]["$post"]
         >["json"],
      ) =>
         honoMutationFn(
            await hc.auth["verify-login-otp"].$post({ json: data }),
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
         error: (error: Error) => error.message,
         position: isMobile ? "top-center" : "bottom-center",
      })
   }

   const loginWithGoogle = useMutation({
      mutationFn: async () => {
         const url = hc.auth[":provider"]
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

   const loginWithPasskey = useMutation({
      mutationFn: async (
         json: InferRequestType<typeof hc.auth.passkey.login.$post>["json"],
      ) => honoMutationFn(await hc.auth.passkey.login.$post({ json })),
      onSuccess: () => {
         navigate({ to: "/" })
      },
   })

   const requestChallenge = useMutation({
      mutationFn: async () =>
         honoMutationFn(await hc.auth.passkey.challenge.$post()),
      onSuccess: async (data) => {
         const challenge = decodeBase64(data)

         const credential = await navigator.credentials.get({
            publicKey: {
               challenge,
               userVerification: "required",
            },
         })

         if (!(credential instanceof PublicKeyCredential))
            throw new Error("Failed to create public key")
         if (!(credential.response instanceof AuthenticatorAssertionResponse))
            throw new Error("Unexpected error")

         loginWithPasskey.mutate({
            credentialId: encodeBase64(new Uint8Array(credential.rawId)),
            signature: encodeBase64(
               new Uint8Array(credential.response.signature),
            ),
            authenticatorData: encodeBase64(
               new Uint8Array(credential.response.authenticatorData),
            ),
            clientData: encodeBase64(
               new Uint8Array(credential.response.clientDataJSON),
            ),
         })
      },
      onError: (error) => {
         if (error instanceof DOMException)
            return toast("Request was cancelled")
         toast.error(error.message)
      },
   })

   return (
      <>
         <Link
            to="/"
            className={cn(
               buttonVariants({ variant: "ghost", kind: "icon" }),
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
                        <Separator className="grow bg-primary-5" />
                        or
                        <Separator className="grow bg-primary-5" />
                     </span>
                     <Button
                        disabled={
                           requestChallenge.isPending ||
                           loginWithPasskey.isPending ||
                           loginWithPasskey.isSuccess
                        }
                        variant={"secondary"}
                        className="mb-2 w-full"
                        onClick={() => requestChallenge.mutate()}
                     >
                        {requestChallenge.isPending ||
                        loginWithPasskey.isPending ||
                        loginWithPasskey.isSuccess ? (
                           "Confirm passkey.."
                        ) : (
                           <>
                              <svg
                                 className="size-[17px]"
                                 viewBox="0 0 20 20"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.71885 2.38913C3.40134 3.97643 2.78933 7.17165 4.35188 9.52585C5.46356 11.2008 7.37712 12 9.22596 11.7479C9.23595 11.7465 9.24677 11.745 9.25834 11.7433C9.36488 11.7282 9.53443 11.7042 9.69409 11.7229C9.85315 11.7415 10.0026 11.8 10.0938 11.8357C10.1032 11.8393 10.1119 11.8428 10.12 11.8459L11.1072 12.2264C11.115 12.2294 11.1229 12.2325 11.1308 12.2355C11.2636 12.2867 11.4138 12.3445 11.5392 12.4097C11.6887 12.4874 11.8647 12.6052 12.0033 12.8081C12.1419 13.0109 12.1889 13.2197 12.2083 13.3891C12.2245 13.5313 12.2253 13.6944 12.226 13.8387C12.226 13.8473 12.2261 13.8559 12.2261 13.8644L12.23 14.6282C12.2304 14.6956 12.2307 14.7493 12.2315 14.7956C12.2734 14.8137 12.3223 14.8341 12.3837 14.8597L13.1966 15.1988C13.3085 15.2453 13.4366 15.2987 13.545 15.3572C13.6744 15.427 13.8261 15.5293 13.9541 15.6984C14.0821 15.8675 14.1404 16.0427 14.1735 16.1878C14.2013 16.3092 14.2191 16.4487 14.2347 16.5705L14.4063 17.9083C14.4156 17.9804 14.423 18.038 14.43 18.0876C14.4783 18.0978 14.5344 18.109 14.6047 18.1228L16.0396 18.4065C16.1468 18.4276 16.2342 18.4449 16.3101 18.4585C16.3177 18.3806 16.325 18.2905 16.3338 18.1799L16.4897 16.242C16.5045 16.0583 16.5123 15.9561 16.5135 15.8788C16.514 15.8444 16.5129 15.8253 16.512 15.8154C16.5116 15.8107 16.511 15.8071 16.511 15.8071L16.5108 15.8059L16.5104 15.8047C16.5104 15.8047 16.5092 15.8013 16.5073 15.797C16.5033 15.7879 16.4951 15.7707 16.478 15.741C16.4397 15.6741 16.3836 15.589 16.2822 15.4361L13.1941 10.7835C13.19 10.7773 13.1859 10.7711 13.1817 10.7648C13.1082 10.6541 13.0276 10.5328 12.9673 10.4211C12.8981 10.2927 12.8214 10.1174 12.8062 9.89783C12.7903 9.66607 12.8521 9.46991 12.9033 9.3362C12.9511 9.21129 13.0195 9.06891 13.086 8.93034L13.0959 8.90963C13.8629 7.31117 13.7914 5.35533 12.7443 3.77774C11.1818 1.42353 8.03636 0.801831 5.71885 2.38913ZM3.11935 10.37C1.09784 7.32434 1.88961 3.1906 4.88783 1.13708C7.88604 -0.916448 11.9553 -0.112136 13.9768 2.93356C15.3327 4.97633 15.4221 7.50796 14.4322 9.57124C14.3938 9.65116 14.3637 9.71396 14.3386 9.76838C14.3351 9.77604 14.3318 9.78333 14.3286 9.79027C14.3549 9.83128 14.3863 9.87856 14.4267 9.93936L17.5147 14.5919C17.5271 14.6107 17.5397 14.6295 17.5524 14.6485C17.7067 14.8798 17.873 15.1289 17.9489 15.4237C18.0248 15.7185 17.9999 16.0185 17.9769 16.2969C17.975 16.3198 17.9731 16.3425 17.9713 16.365L17.8154 18.3029C17.8144 18.3153 17.8134 18.3278 17.8124 18.3403C17.7941 18.5687 17.7747 18.8117 17.7305 19.012C17.6793 19.2443 17.5705 19.5432 17.284 19.7638C16.9974 19.9844 16.6848 20.01 16.4507 19.9973C16.2489 19.9864 16.0134 19.9398 15.7919 19.8959C15.7798 19.8935 15.7677 19.8911 15.7557 19.8887L14.3208 19.6051C14.3122 19.6034 14.3036 19.6017 14.2949 19.6C14.1487 19.5712 13.9843 19.5387 13.8445 19.4939C13.6783 19.4406 13.4774 19.3498 13.3039 19.1621C13.1304 18.9745 13.0537 18.7651 13.0117 18.5932C12.9764 18.4487 12.9548 18.28 12.9357 18.13L12.7635 16.7876C12.756 16.7292 12.75 16.6829 12.7444 16.6431C12.708 16.6274 12.6655 16.6096 12.6119 16.5873L11.8191 16.2566C11.8116 16.2535 11.804 16.2503 11.7963 16.2471C11.6685 16.1939 11.5236 16.1335 11.4027 16.0668C11.2585 15.9872 11.0895 15.8683 10.9569 15.6686C10.8244 15.4689 10.7793 15.2651 10.7607 15.0995C10.7451 14.9605 10.7443 14.8015 10.7437 14.6611C10.7436 14.6527 10.7436 14.6444 10.7435 14.6361L10.7396 13.8722C10.7393 13.8029 10.739 13.7476 10.7381 13.7C10.6944 13.6825 10.6436 13.6628 10.5798 13.6383L9.59259 13.2577C9.56414 13.2467 9.54224 13.2383 9.5234 13.2312C9.52108 13.2315 9.51867 13.2318 9.51617 13.2321C9.49098 13.2353 9.46174 13.2393 9.42372 13.2445C7.0364 13.57 4.55896 12.539 3.11935 10.37Z"
                                    fill="currentColor"
                                 />
                                 <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.95045 5.75151C7.44981 6.09441 7.3176 6.78466 7.65515 7.29322C7.9927 7.80179 8.67219 7.9361 9.17283 7.5932C9.67347 7.2503 9.80568 6.56005 9.46813 6.05149C9.13058 5.54292 8.45109 5.40861 7.95045 5.75151ZM6.42262 8.13741C5.62611 6.93735 5.93808 5.30858 7.11943 4.49946C8.30078 3.69033 9.90415 4.00725 10.7007 5.2073C11.4972 6.40736 11.1852 8.03613 10.0039 8.84525C8.8225 9.65438 7.21913 9.33746 6.42262 8.13741Z"
                                    fill="currentColor"
                                 />
                              </svg>
                              Continue with passkey
                           </>
                        )}
                     </Button>
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
                              kind: "icon",
                              variant: "ghost",
                           }),
                           "absolute top-2 left-2 z-[2] cursor-pointer text-foreground/90",
                        )}
                     >
                        <Icons.arrowLeft className="size-5" />
                     </Link>
                     <div>
                        <>
                           <p className="mt-7 text-center font-medium text-lg">
                              Enter the code sent to your email
                           </p>
                           <div className="my-8">
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
                                    if (isMobile) {
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
                           </div>
                           <p className="mb-2 text-center text-foreground/70 leading-relaxed">
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
                     </div>
                  </Card>
               </AnimatedStack>
            </div>
         </main>
      </>
   )
}
