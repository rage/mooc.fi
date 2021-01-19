import { createContext, useContext } from "react"

export type Anchor = {
  id: number
  tab: number
}

interface AnchorContext {
  anchors: Record<string, Anchor>
  addAnchor: (anchor: string, tab: number) => void
}

const AnchorContext = createContext<AnchorContext>({
  anchors: {},
  addAnchor: (_: string, __: number) => {},
})

export default AnchorContext

export function useAnchorContext() {
  return useContext(AnchorContext)
}
