import { createContext, useContext } from "react"

export type LegacyAnchor = {
  id: number
  tab: number
}

export interface LegacyAnchorContext {
  anchors: Record<string, LegacyAnchor>
  addAnchor: (anchor: string, tab: number) => void
}

const LegacyAnchorContextImpl = createContext<LegacyAnchorContext>({
  anchors: {},
  addAnchor: (_: string, __: number) => void 0,
})

export default LegacyAnchorContextImpl

export function useLegacyAnchorContext() {
  return useContext(LegacyAnchorContextImpl)
}
