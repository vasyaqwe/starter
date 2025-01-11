export const isNative =
   "__TAURI_INTERNALS__" in window && window.__TAURI_INTERNALS__ !== undefined

export const MOBILE_BREAKPOINT = 768

export const focusStyles =
   "focus-visible:border-primary-11 focus-visible:outline-primary-7 outline outline-3 outline-hidden outline-offset-0"

export const dialogStyles = {
   transition:
      "transition-all duration-150 data-[ending-style]:scale-[98%] data-[starting-style]:scale-[102%] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
   popup: "-mt-8 -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-96 max-w-[calc(100vw-3rem)] rounded-xl bg-primary-2 p-4 shadow-sm dark:shadow-xl shadow-black/15 dark:shadow-black/75 outline outline-transparent dark:outline-primary-5",
   backdrop:
      "fixed inset-0 bg-black opacity-25 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-50",
   title: "-mt-1 mb-2 font-semibold text-lg",
   description: "mb-6 text-foreground/75 text-sm",
   footer: "flex justify-end gap-3 pt-3",
}

export const popupStyles = {
   transition:
      "origin-(--transform-origin) transition-[transform_150ms_var(--ease-vaul),opacity_150ms_var(--ease-vaul)] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0",
   base: "rounded-xl bg-primary-12 text-white shadow-md outline-1 outline-transparent outline-offset-0 dark:bg-primary-3 dark:shadow-lg dark:shadow-black/35 dark:outline-primary-6",
   separator:
      "-mx-(--padding) mt-0.5 mb-1 h-px w-[calc(100%+calc(var(--padding)*2))] bg-black shadow-[0px_1px_0px_var(--color-white-a3)] dark:bg-primary-2 dark:shadow-[0px_1px_0px_var(--color-primary-6)]",
}

export const menuItemStyles = {
   base: "cursor-(--cursor) text-sm h-8 flex items-center select-none gap-2 rounded-[calc(var(--radius-xl)-var(--padding))] px-2 py-[5px] focus-visible:border-transparent [&>svg]:size-5 [&>svg]:text-primary-8 hover:[&>svg]:text-white focus:[&>svg]:text-white dark:[&>svg]:text-primary-11 hover:bg-primary-11 hover:shadow-sm focus-visible:outline-none focus-visible:outline-hidden focus-visible:bg-primary-11 shadow-black/20 focus-visible:shadow-sm dark:hover:bg-primary-6 dark:focus-visible:bg-primary-6",
   destructive:
      "hover:bg-red-9 focus-visible:bg-red-9 dark:focus-visible:bg-red-9 dark:hover:bg-red-9",
}
