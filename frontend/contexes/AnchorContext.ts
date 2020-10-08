import { createContext } from "react"

export type Anchor = {
  id: number
  tab: number
}

interface AnchorContext {
  anchors: Record<string, Anchor>
  addAnchor: (anchor: string, tab: number) => void
}

export default createContext<AnchorContext>({
  anchors: {} as Record<string, Anchor>,
  addAnchor: (_: string, __: number) => {},
})
