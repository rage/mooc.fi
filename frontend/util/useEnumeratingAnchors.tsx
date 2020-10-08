import { Anchor } from "/contexes/AnchorContext"

export function useEnumeratingAnchors(): [
  Record<string, Anchor>,
  (_: string, __: number) => void,
] {
  let anchorId = 0

  const anchors: Record<string, Anchor> = {}
  const addAnchor = (anchor: string, tab: number) =>
    (anchors[anchor] = {
      id: anchorId++,
      tab,
    })

  return [anchors, addAnchor]
}
