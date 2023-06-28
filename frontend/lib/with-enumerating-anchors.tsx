import React, { useMemo } from "react"

import { PropsOf } from "@emotion/react"

import LegacyAnchorContext, {
  LegacyAnchor,
} from "/components/Dashboard/EditorLegacy/LegacyAnchorContext"

const withEnumeratingAnchors = <C extends React.ElementType = any>(
  Component: C,
): C =>
  ((props: PropsOf<C>) => {
    let anchorId = 0
    const anchors: Record<string, LegacyAnchor> = {}
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
      <LegacyAnchorContext.Provider value={contextValue}>
        <Component {...props} />
      </LegacyAnchorContext.Provider>
    )
  }) as C

export default withEnumeratingAnchors
