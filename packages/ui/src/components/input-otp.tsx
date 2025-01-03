import { OTPInput, OTPInputContext } from "input-otp"
import * as React from "react"
import { cn } from "../utils"

function InputOTP({
   className,
   containerClassName,
   ...props
}: React.ComponentPropsWithoutRef<typeof OTPInput>) {
   return (
      <OTPInput
         containerClassName={cn(
            "flex items-center gap-3 has-[:disabled]:opacity-70",
            containerClassName,
         )}
         className={cn("disabled:cursor-not-allowed", className)}
         {...props}
      />
   )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("flex items-center", className)}
         {...props}
      />
   )
}

function InputOTPSlot({
   index,
   className,
   ...props
}: React.ComponentProps<"div"> & { index: number }) {
   const inputOTPContext = React.useContext(OTPInputContext)
   const context = inputOTPContext.slots[index]
   if (!context) return null
   const { char, hasFakeCaret, isActive } = context

   return (
      <div
         className={cn(
            "relative flex h-10 w-full items-center justify-center rounded-lg border border-input border-primary-6 bg-white shadow-xs dark:bg-primary-2 dark:shadow-sm",
            isActive && "z-10 border-primary-11",
            className,
         )}
         {...props}
      >
         {char}
         {hasFakeCaret && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
               <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
            </div>
         )}
      </div>
   )
}

function InputOTPSeparator({
   className,
   ...props
}: React.ComponentProps<"hr">) {
   return (
      <hr
         className={cn("", className)}
         {...props}
      />
   )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
