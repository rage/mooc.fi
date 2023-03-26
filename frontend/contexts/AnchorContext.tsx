import { createContext, useCallback, useContext, useMemo } from "react"

import { orderBy } from "lodash"
import { FieldErrors, FieldValues } from "react-hook-form"

import {
  useEditorContext,
  useEditorMethods,
} from "/components/Dashboard/Editor/EditorContext"
import { convertDotNotation } from "/util/convertDotNotation"
import flattenKeys from "/util/flattenKeys"

let nextId = 0

export type Anchor<ElemType extends HTMLElement = HTMLElement> = {
  id: number
  name: string
  refInstance: React.MutableRefObject<ElemType | undefined>
  ref: React.RefCallback<ElemType>
  tab?: number
}

interface AnchorContext {
  addAnchor: (
    name: string,
    ref: React.MutableRefObject<HTMLElement | undefined>,
    tab?: number,
  ) => Anchor
  anchors: Record<string, Anchor>
}

const AnchorContextImpl = createContext<AnchorContext>({
  addAnchor: () => {
    return {} as Anchor<any>
  },
  anchors: {},
})

export default AnchorContextImpl

export function useAnchorContext() {
  return useContext(AnchorContextImpl)
}

export function createAnchorContext(): AnchorContext {
  console.log("create anchor context")
  const anchors: Record<string, Anchor> = {}
  const addAnchor = (
    name: string,
    ref: React.MutableRefObject<HTMLElement | undefined>,
    tab?: number,
  ) => {
    if (!anchors[name]) {
      anchors[name] = {
        id: nextId++,
        name,
        refInstance: ref,
        ref: <ElemType extends HTMLElement = HTMLDivElement>(
          elem: ElemType,
        ) => {
          ref.current = elem
        },
        tab,
      }
    }

    return anchors[name]
  }

  return { anchors, addAnchor }
}

export function AnchorContextProvider({
  value,
  children,
}: React.PropsWithChildren<{ value?: AnchorContext }>) {
  const { anchors, addAnchor } = value ?? createAnchorContext()
  const contextValue = useMemo(() => ({ anchors, addAnchor }), [anchors])

  return (
    <AnchorContextImpl.Provider value={contextValue}>
      {children}
    </AnchorContextImpl.Provider>
  )
}

function isVisible(elem: HTMLElement) {
  if (!(elem instanceof Element)) {
    throw Error("DomUtil: elem is not an element.")
  }
  const style = getComputedStyle(elem)
  if (style.display === "none") {
    return false
  }
  if (style.visibility !== "visible") {
    return false
  }
  if (Number(style.opacity) === 0) {
    return false
  }
  if (
    elem.offsetWidth +
      elem.offsetHeight +
      elem.getBoundingClientRect().height +
      elem.getBoundingClientRect().width ===
    0
  ) {
    return false
  }
  const elemCenter = {
    x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
    y: elem.getBoundingClientRect().top + elem.offsetHeight / 2,
  }
  if (elemCenter.x < 0) {
    return false
  }
  if (
    elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)
  ) {
    return false
  }
  if (elemCenter.y < 0) {
    return false
  }
  if (
    elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)
  ) {
    return false
  }
  let pointContainer: ParentNode | Node | null | undefined =
    document.elementFromPoint(elemCenter.x, elemCenter.y)
  do {
    if (pointContainer === elem) {
      return true
    }
  } while ((pointContainer = pointContainer?.parentNode))
  return false
}

export function useScrollErrorIntoView() {
  const { tab, anchors } = useEditorContext()
  const { setTab } = useEditorMethods()

  console.log("anchors", anchors, "tab", tab)
  const scrollFirstErrorIntoView = useCallback(
    <TFieldValues extends FieldValues = FieldValues>(
      errors: FieldErrors<TFieldValues>,
    ) => {
      console.log("inside scrollfirsterrorintoview fn", anchors, tab)
      const flattenedErrors = flattenKeys(errors)
      const errorAnchors = Object.values(anchors).filter((anchor) =>
        Object.keys(flattenedErrors).includes(convertDotNotation(anchor.name)),
      )
      const firstErrorAnchor = orderBy(errorAnchors, (anchor) => anchor.id)[0]

      const firstRef = firstErrorAnchor?.refInstance.current
      const firstTab = firstErrorAnchor?.tab

      if (firstRef?.scrollIntoView && !isVisible(firstRef)) {
        if (!firstTab || Number(firstTab) === tab) {
          firstRef.scrollIntoView({
            block: "center",
          })
        } else {
          setTab?.(Number(firstTab))
          setTimeout(() => {
            firstRef.scrollIntoView({
              block: "center",
            })
          }, 100)
        }
      }
    },
    [anchors, tab, setTab],
  )

  return {
    scrollFirstErrorIntoView,
  }
}
