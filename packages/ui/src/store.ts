import { create } from "zustand"
import { createSelectors } from "./utils"

type StoreState = {
   isMobile: boolean
}

const store = create<StoreState>()(() => ({
   isMobile: true,
}))

export const useUIStore = createSelectors(store)
