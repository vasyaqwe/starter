import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const isPWA = () => {
   if (
      "standalone" in window.navigator &&
      window.navigator.standalone === true
   ) {
      return true
   }

   if (window.navigator.userAgent.indexOf("Safari") === -1) {
      return true
   }

   if (window.matchMedia("(display-mode: standalone)").matches) {
      return true
   }

   return false
}

export const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs))
