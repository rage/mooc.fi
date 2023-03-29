import { createContext, Dispatch, SetStateAction, useContext } from "react"

import { FieldErrors, SubmitErrorHandler, SubmitHandler } from "react-hook-form"

import { FormValues } from "./types"
import { Anchor } from "/hooks/useAnchors"

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
