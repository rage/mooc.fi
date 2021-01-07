import { Anchor } from "/contexes/AnchorContext"
import flattenKeys from "/util/flattenKeys"

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

export function getFirstErrorAnchor(
  anchors: Record<string, Anchor>,
  errors: Record<string, any>,
) {
  console.log(anchors, errors)
  const flattenedErrors = flattenKeys(errors)

  const [key, value] = Object.entries(flattenedErrors).sort(
    (a, b) => anchors[a[0]]?.id - anchors[b[0]]?.id,
  )[0]
  const anchor = anchors[key]

  let anchorLink = key
  if (Array.isArray(value)) {
    const firstIndex = parseInt(Object.keys(value)[0])
    anchorLink = `${key}[${firstIndex}].${Object.keys(value[firstIndex])[0]}`
  }

  return { anchor, anchorLink }
}
