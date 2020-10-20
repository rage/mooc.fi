import AnchorContext, { Anchor } from "/contexes/AnchorContext"

const withEnumeratingAnchors = <T,>(Component: any) => (props: any) => {
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

  return (
    <AnchorContext.Provider value={{ anchors, addAnchor }}>
      <Component {...(props as T)}>{props.children}</Component>
    </AnchorContext.Provider>
  )
}

export default withEnumeratingAnchors
