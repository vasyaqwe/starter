import { create } from "zustand"
import { createSelectors } from "./utils"

type StoreState = {
   isMobile: boolean
   historyLength: number
}

const store = create<StoreState>()(() => ({
   isMobile: true,
   historyLength: 0,
}))

export const useUIStore = createSelectors(store)
