import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import type { StoreApi, UseBoundStore } from "zustand"

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

type WithSelectors<S> = S extends { getState: () => infer T }
   ? S & { use: { [K in keyof T]: () => T[K] } }
   : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
   _store: S,
) => {
   const store = _store as WithSelectors<typeof _store>
   store.use = {}
   for (const k of Object.keys(store.getState())) {
      // biome-ignore lint/suspicious/noExplicitAny: ...
      ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
   }

   return store
}
