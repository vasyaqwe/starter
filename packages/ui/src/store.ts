import { create } from "zustand"
import { createSelectors } from "./utils"

type StoreState = {
   isMobile: boolean
   historyLength: number
   fileTriggerOpen: boolean
}

const store = create<StoreState>()(() => ({
   isMobile: true,
   historyLength: 0,
   fileTriggerOpen: false,
}))

export const useUIStore = createSelectors(store)
