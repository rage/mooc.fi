import React, { useMemo } from "react"

import { PropsOf } from "@emotion/react"

import AnchorContext, { Anchor } from "/contexts/AnchorContext"

const withEnumeratingAnchors = <C extends React.ElementType = any>(
  Component: C,
): C =>
  ((props: PropsOf<C>) => {
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
        <Component {...props} />
      </AnchorContext.Provider>
    )
  }) as C

export default withEnumeratingAnchors
