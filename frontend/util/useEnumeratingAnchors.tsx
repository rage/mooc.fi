import { Anchor } from "../contexts/AnchorContext"
import flattenKeys from "/util/flattenKeys"
import { useRef } from "react"

export function useEnumeratingAnchors(): [
  Record<string, Anchor>,
  (_: string, __: number) => void,
] {
  const anchorId = useRef(0)
  const anchors = useRef<Record<string, Anchor>>({})
  const addAnchor = (anchor: string, tab: number) =>
    (anchors.current[anchor] = {
      id: anchorId.current++,
      tab,
    })

  return [anchors.current, addAnchor]
}

export function getFirstErrorAnchor(
  anchors: Record<string, Anchor>,
  errors: Record<string, any>,
) {
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
