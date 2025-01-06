import type { FLAGS } from "@/dev/constants"
import { createSelectors } from "@project/ui/utils"
import { create } from "zustand"

type Flag = (typeof FLAGS)[number]

type StoreState = {
   flags: Record<Flag, boolean>
   toggleFlag: (flag: Flag) => void
}

const store = create<StoreState>()((set, _get) => ({
   flags: {
      CHAT: true,
   },
   toggleFlag: (newFlag) => {
      set((state) => ({
         flags: { ...state.flags, [newFlag]: !state.flags[newFlag] },
      }))
   },
}))

export const useDevStore = createSelectors(store)
