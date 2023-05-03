import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
} from "react"

import { orderBy } from "lodash"
import { FieldErrors, FieldValues } from "react-hook-form"

import {
  useEditorContext,
  useEditorMethods,
} from "/components/Dashboard/Editor/EditorContext"
import { convertDotNotation } from "/util/convertDotNotation"
import flattenKeys from "/util/flattenKeys"
import notEmpty from "/util/notEmpty"

export type Anchor<ElemType extends HTMLElement = HTMLElement> = {
  id: number
  name: string
  refInstance: React.MutableRefObject<ElemType | undefined>
  ref: React.RefCallback<ElemType>
  tab?: number
}

export function useAnchors(initialAnchors?: Record<string, Anchor>) {
  let nextId = 0
  const anchors = initialAnchors ?? {}

  const addAnchor = useCallback(
    (
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
    },
    [anchors],
  )

  const scrollAndSetError = useCallback((ref: HTMLElement) => {
    ref.scrollIntoView({
      block: "center",
    })
    ref.setAttribute("data-error-pulsate", "true")
    ref.parentElement?.setAttribute("data-error-pulsate", "true")
    const timeout = setTimeout(() => {
      ref.removeAttribute("data-error-pulsate")
      ref.parentElement?.removeAttribute("data-error-pulsate")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [])

  const scrollFirstErrorIntoView = useCallback(
    <TFieldValues extends FieldValues = FieldValues>(
      errors: FieldErrors<TFieldValues>,
      tab?: number,
      setTab?: Dispatch<SetStateAction<number>>,
      isRetry?: boolean,
    ) => {
      const flattenedErrors = flattenKeys(errors)
      const errorAnchors = Object.values(anchors).filter((anchor) =>
        Object.keys(flattenedErrors).includes(convertDotNotation(anchor.name)),
      )
      const firstErrorAnchor = orderBy(errorAnchors, (anchor) => anchor.id)[0]

      const firstRef = firstErrorAnchor?.refInstance.current
      const firstTab = firstErrorAnchor?.tab

      if (firstRef?.scrollIntoView && !isVisible(firstRef)) {
        if (!notEmpty(firstTab) || Number(firstTab) === tab) {
          scrollAndSetError(firstRef)
        } else {
          setTab?.(Number(firstTab))
          setTimeout(() => {
            scrollAndSetError(firstRef)
          }, 100)
        }
      }
      if (
        !firstRef &&
        notEmpty(firstTab) &&
        Number(firstTab) !== tab &&
        !isRetry
      ) {
        // the element has not mounted, change tab and try again _once_
        setTab?.(Number(firstTab))
        setTimeout(() => {
          // next tick
          const redo = () => scrollFirstErrorIntoView(errors, tab, setTab, true)
          setTimeout(redo, 100)
        })
      }
    },
    [anchors],
  )

  return { anchors, addAnchor, scrollFirstErrorIntoView }
}

export function useAnchor(name: string) {
  const { anchors, tab } = useEditorContext()
  const { addAnchor } = useEditorMethods()
  const ref = useRef<HTMLElement>()

  const anchor = useMemo(() => {
    if (!anchors[name]) {
      return addAnchor(name, ref, tab)
    }

    return anchors[name]
  }, [anchors, name])

  return anchor
}

// https://github.com/react-hook-form/react-hook-form/issues/10063#issuecomment-1461901327
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
