import type { FLAGS } from "@/dev/constants"
import { atom } from "jotai"

type Flag = (typeof FLAGS)[number]

export const flagsAtom = atom<Record<Flag, boolean>>({
   CHAT: true,
})
