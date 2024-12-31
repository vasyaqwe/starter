import { cn } from "./utils"

export const MOBILE_BREAKPOINT = 768

export const focusStyles = cn(
   "focus-visible:border-primary-11 focus-visible:outline-primary-7",
   "outline outline-3 outline-hidden outline-offset-0",
)

export const popupTransitionStyles = cn(
   "origin-(--transform-origin) transition-[transform_150ms_var(--ease-vaul),opacity_150ms_var(--ease-vaul)] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0",
)

export const popupStyles = cn(
   "rounded-xl bg-primary-12 text-white shadow-md outline-1 outline-transparent outline-offset-0 dark:bg-primary-3 dark:shadow-lg dark:outline-primary-4 dark:outline-primary-6",
)

export const menuItemStyles = cn(
   "flex select-none rounded-[calc(12px-var(--padding))] px-2 py-[5px] text-base focus-visible:border-transparent [&>svg]:size-5 [&>svg]:text-primary-8 hover:[&>svg]:text-white focus:[&>svg]:text-white dark:[&>svg]:text-primary-11",
)

export const menuItemDestructiveStyles = cn(
   "hover:bg-red-9 focus-visible:bg-red-9 dark:focus-visible:bg-red-9 dark:hover:bg-red-9",
)

export const inputStyles = cn(
   "h-9 w-full rounded-[10px] border border-primary-7 bg-white px-3 text-base outline-hidden placeholder:text-foreground/40 focus:border-primary-11 dark:bg-primary-2",
)
