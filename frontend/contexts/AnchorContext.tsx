import { createContext, useContext, useMemo } from "react"

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
