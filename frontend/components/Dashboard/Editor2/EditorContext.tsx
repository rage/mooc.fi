import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Anchor } from "/contexes/AnchorContext"

export interface EditorContext<T extends Record<string, any>> {
  status: FormStatus
  setStatus: Dispatch<SetStateAction<FormStatus>>
  tab: number
  setTab: Dispatch<SetStateAction<number>>
  onSubmit: SubmitHandler<T>
  onError: SubmitErrorHandler<Record<string, any>>
  onCancel: () => void
  onDelete: (id: string) => void
  initialValues: T
}

export const EditorContext = createContext<EditorContext<any>>({
  status: { message: null },
  setStatus: (_: any) => {},
  tab: 0,
  setTab: (_: any) => {},
  /*history: { states: [], index: -1 } as FormHistory<T>,
  undo: () => { },
  redo: () => { },
  push: () => { },*/
  onSubmit: () => {},
  onError: () => {},
  onCancel: () => {},
  onDelete: () => {},
  initialValues: {},
})

/*export const createEditorContext = once(<T,>() => createContext<EditorContext<T>>({
    status: { message: null },
    setStatus: (_: any) => { },
    history: { states: [], index: -1 } as FormHistory<T>,
    undo: () => { },
    redo: () => { },
    push: () => { },
    onSubmit: () => {},
    onError: () => {},
    onCancel: () => {},
    onDelete: () => {}
  }))*/

export function useEditorContext<T>() {
  return useContext<EditorContext<T>>(EditorContext)
}


