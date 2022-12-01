import { useMemo } from "react"

import AnchorContext, { Anchor } from "/contexts/AnchorContext"

const withEnumeratingAnchors =
  <T,>(Component: any) =>
  (props: any) => {
    let anchorId = 0
    const anchors: Record<string, Anchor> = {}
    const addAnchor = (anchor: string, tab = 0) => {
      if (!anchors[anchor]) {
        anchors[anchor] = {
          id: anchorId++,
          tab,
        }
      }
    }

    const contextValue = useMemo(() => ({ anchors, addAnchor }), [anchors])

    return (
      <AnchorContext.Provider value={contextValue}>
        <Component {...(props as T)}>{props.children}</Component>
      </AnchorContext.Provider>
    )
  }

export default withEnumeratingAnchors
