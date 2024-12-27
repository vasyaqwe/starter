import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"
import { cn } from "../utils"

const loadingVariants = cva("relative block opacity-80", {
   variants: {
      size: {
         sm: "size-[17px]",
         md: "size-[18px]",
         lg: "size-[19px]",
      },
   },
   defaultVariants: {
      size: "md",
   },
})

export function Loading({
   className,
   size,
   ...props
}: React.HTMLAttributes<HTMLOrSVGElement> &
   VariantProps<typeof loadingVariants>) {
   return (
      <svg
         className={cn(
            loadingVariants({ size, className }),
            "animate-spin",
            className,
         )}
         viewBox="0 0 24 24"
         {...props}
      >
         <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="m17 6.99 2.36-2.37M4.63 19.34l2.36-2.37m0-10L4.62 4.6m14.72 14.72-2.37-2.37m1.65-5h3.34m-20 0H5.3m6.65-6.66V1.94m0 20v-3.35"
         />
      </svg>
   )
}
