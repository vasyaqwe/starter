import { useAtomValue } from "jotai"
import type * as React from "react"
import { Toaster as Sonner, toast } from "sonner"
import { isMobileAtom } from "../store"
import { cn } from "../utils"
import { buttonVariants } from "./button"
import { Loading } from "./loading"

function Toaster(props: React.ComponentProps<typeof Sonner>) {
   const isMobile = useAtomValue(isMobileAtom)

   return (
      <Sonner
         className="max-md:!bottom-(--offset)"
         icons={{
            loading: <Loading />,
            success: (
               <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-green-10 dark:text-green-8"
               >
                  <circle
                     cx="7"
                     cy="7"
                     r="6"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeDasharray="3.14 0"
                     strokeDashoffset="-0.7"
                  />
                  <circle
                     cx="7"
                     cy="7"
                     r="3"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="6"
                     strokeDasharray="18.84955592153876 100"
                     strokeDashoffset="0"
                     transform="rotate(-90 7 7)"
                  />
                  <path
                     stroke="none"
                     fill="white"
                     d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z"
                  />
               </svg>
            ),
            error: (
               <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-red-9 dark:text-red-10"
               >
                  <circle
                     cx="10"
                     cy="10"
                     r="10"
                     fill="currentColor"
                  />
                  <path
                     d="M14 6L6 14"
                     stroke="white"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M6 6L14 14"
                     stroke="white"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
            ),
            info: (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
               >
                  <path
                     fillRule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         }}
         toastOptions={{
            unstyled: true,
            style: {
               translate: "-50% 0",
            },
            classNames: {
               icon: "!mr-2.5 !size-[18px]",
               actionButton: cn(
                  buttonVariants({ variant: "menu-item" }),
                  "-m-2 !-mr-[12px] !ml-2.5 h-[34px] rounded-full bg-primary-11/60 px-3 hover:bg-primary-11 dark:bg-primary-7 dark:hover:bg-primary-8",
               ),
            },
            className:
               "font-primary px-4 py-3 items-center shadow-lg justify-center flex select-none border border-transparent dark:border-primary-6 !w-max !max-w-(--width) !left-1/2 dark:bg-primary-5 bg-primary-12 text-base text-white !right-auto justify-center pointer-events-auto rounded-full",
         }}
         expand
         offset={
            isMobile
               ? `${getComputedStyle(document.documentElement).getPropertyValue("--sat") + 62}px`
               : "24px"
         }
         position="bottom-center"
         {...props}
      />
   )
}

export { toast, Toaster }
