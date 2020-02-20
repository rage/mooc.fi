import { createContext } from "react"

interface AnchorContext {
  anchors: Record<string, number>
  addAnchor: (anchor: string) => void
}

export default createContext<AnchorContext>({
  anchors: {} as Record<string, number>,
  addAnchor: (_: string) => {},
})
