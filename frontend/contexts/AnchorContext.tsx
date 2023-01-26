import { createContext, useContext } from "react"

export type Anchor = {
  id: number
  tab: number
}

export interface AnchorContext {
  anchors: Record<string, Anchor>
  addAnchor: (anchor: string, tab: number) => void
}

const AnchorContextImpl = createContext<AnchorContext>({
  anchors: {},
  addAnchor: (_: string, __: number) => void 0,
})

export default AnchorContextImpl

export function useAnchorContext() {
  return useContext(AnchorContextImpl)
}
