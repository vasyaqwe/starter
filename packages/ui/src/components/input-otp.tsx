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
            "flex items-center gap-2 has-[:disabled]:opacity-50",
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
            "relative flex h-9 w-9 items-center justify-center border-input border-y border-r text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
            isActive && "z-10 ring-1 ring-ring",
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
