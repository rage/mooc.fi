import { FormStatus, FormValues } from "/components/Dashboard/Editor2/types"
import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form"

export interface EditorContext<T extends FormValues> {
  status: FormStatus
  setStatus: Dispatch<SetStateAction<FormStatus>>
  tab: number
  setTab: Dispatch<SetStateAction<number>>
  onSubmit: SubmitHandler<T>
  onError: SubmitErrorHandler<T>
  onCancel: () => void
  onDelete: (id: string) => void
  initialValues: T
}

export const EditorContext = createContext<EditorContext<any>>({
  status: { message: null },
  setStatus: (_: any) => {},
  tab: 0,
  setTab: (_: any) => {},
  onSubmit: () => {},
  onError: () => {},
  onCancel: () => {},
  onDelete: () => {},
  initialValues: {},
})

export function useEditorContext<T>() {
  return useContext<EditorContext<T>>(EditorContext)
}
