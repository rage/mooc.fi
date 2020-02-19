export function useEnumeratingAnchors(): [
  Record<string, number>,
  (_: string) => void,
] {
  let anchorId = 0

  const anchors: Record<string, number> = {}
  const addAnchor = (anchor: string) => (anchors[anchor] = anchorId++)

  return [anchors, addAnchor]
}
