import React, { useMemo } from "react"

import { PropsOf } from "@emotion/react"

import AnchorContext, { Anchor } from "/contexts/AnchorContext"

const withEnumeratingAnchors =
  <T extends React.ElementType = any>(Component: T) =>
  (props: PropsOf<T>) => {
    let anchorId = 0
    const anchors: Record<string, Anchor> = {}
    const addAnchor = (anchor: string, tab: number = 0) => {
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
        <Component {...props}>{props.children}</Component>
      </AnchorContext.Provider>
    )
  }

export default withEnumeratingAnchors
