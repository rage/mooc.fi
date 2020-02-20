import * as React from "react"
import AnchorContext from "/contexes/AnchorContext"

const withEnumeratingAnchors = <T,>(Component: any) => (props: any) => {
  let anchorId = 0
  const anchors: Record<string, number> = {}
  const addAnchor = (anchor: string) => (anchors[anchor] = anchorId++)

  return (
    <AnchorContext.Provider value={{ anchors, addAnchor }}>
      <Component {...(props as T)}>{props.children}</Component>
    </AnchorContext.Provider>
  )
}

export default withEnumeratingAnchors
