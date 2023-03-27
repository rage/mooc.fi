import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react"

import { orderBy } from "lodash"
import {
  FieldErrors,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
} from "react-hook-form"

import { FormValues } from "./types"
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

export interface EditorContext {
  tab: number
  anchors: Record<string, Anchor>
}

export interface EditorMethodContext<T extends FormValues> {
  onSubmit: SubmitHandler<T>
  onError: SubmitErrorHandler<T>
  onCancel: () => void
  onDelete: (id: string) => void
  setTab: Dispatch<SetStateAction<number>>
  addAnchor: (
    name: string,
    ref: React.MutableRefObject<HTMLElement | undefined>,
    tab?: number,
  ) => Anchor
  scrollFirstErrorIntoView: (
    errors: FieldErrors<T>,
    tab?: number,
    setTab?: Dispatch<SetStateAction<number>>,
  ) => void
}

const EditorContextImpl = createContext<EditorContext>({
  tab: 0,
  anchors: {},
})

const EditorMethodContextImpl = createContext<EditorMethodContext<any>>({
  setTab: (_) => void 0,
  onSubmit: () => void 0,
  onError: () => void 0,
  onCancel: () => void 0,
  onDelete: () => void 0,
  addAnchor: () => ({} as Anchor<any>),
  scrollFirstErrorIntoView: () => void 0,
})

export function useEditorContext() {
  return useContext<EditorContext>(EditorContextImpl)
}

export function useEditorMethods<T extends FormValues>() {
  return useContext<EditorMethodContext<T>>(EditorMethodContextImpl)
}

export function EditorContextProvider<T extends FormValues>(
  props: React.PropsWithChildren<{
    value: EditorContext
    methods: EditorMethodContext<T>
  }>,
) {
  const { value, methods, children } = props

  return (
    <EditorContextImpl.Provider value={value}>
      <EditorMethodContextImpl.Provider value={methods}>
        {children}
      </EditorMethodContextImpl.Provider>
    </EditorContextImpl.Provider>
  )
}

export {
  EditorContextImpl as EditorContext,
  EditorMethodContextImpl as EditorMethodContext,
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
        console.log("creating new anchor", name)
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

  const scrollFirstErrorIntoView = useCallback(
    <TFieldValues extends FieldValues = FieldValues>(
      errors: FieldErrors<TFieldValues>,
      tab?: number,
      setTab?: Dispatch<SetStateAction<number>>,
      retry?: boolean,
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
      if (
        !firstRef &&
        notEmpty(firstTab) &&
        Number(firstTab) !== tab &&
        !retry
      ) {
        // the element has not mounted, change tab and try again _once_
        setTab?.(Number(firstTab))
        setTimeout(() => {
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
  const { anchors } = useEditorContext()
  const { addAnchor } = useEditorMethods()
  const { tab } = useEditorContext()
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
