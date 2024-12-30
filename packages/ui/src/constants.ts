import { cn } from "./utils"

export const MOBILE_BREAKPOINT = 768

export const focusStyles = cn(
   "focus-visible:border-gray-11 focus-visible:outline-gray-7",
   "outline outline-3 outline-hidden outline-offset-0",
)

export const popupTransitionStyles = cn(
   "origin-(--transform-origin) transition-[transform_150ms_var(--ease-vaul),opacity_150ms_var(--ease-vaul)] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0",
)

export const popupStyles = cn(
   "rounded-xl border border-transparent bg-gray-12 text-white shadow-md focus:outline-none dark:border-gray-4 dark:border-gray-6 dark:bg-gray-3 dark:shadow-lg",
)
