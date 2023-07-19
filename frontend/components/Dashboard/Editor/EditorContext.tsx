import { createContext, Dispatch, SetStateAction, useContext } from "react"

import { SubmitErrorHandler, SubmitHandler } from "react-hook-form"

import { FormValues } from "./types"
import { Anchor, ScrollFirstErrorIntoViewArgs } from "/hooks/useAnchors"

export interface EditorContext {
  tab: number
  anchors: Record<string, Anchor>
  isClone?: boolean
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
  scrollFirstErrorIntoView: (args: ScrollFirstErrorIntoViewArgs<T>) => void
}

const EditorContextImpl = createContext<EditorContext>({
  tab: 0,
  anchors: {},
})

const Nop = () => {
  /* */
}

const EditorMethodContextImpl = createContext<EditorMethodContext<any>>({
  setTab: Nop,
  onSubmit: Nop,
  onError: Nop,
  onCancel: Nop,
  onDelete: Nop,
  addAnchor: () => ({}) as Anchor<any>,
  scrollFirstErrorIntoView: Nop,
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
