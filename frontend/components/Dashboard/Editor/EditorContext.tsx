import { createContext, Dispatch, SetStateAction, useContext } from "react"

import { SubmitErrorHandler, SubmitHandler } from "react-hook-form"

import { FormStatus, FormValues } from "./types"

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
  setStatus: (_) => void 0,
  tab: 0,
  setTab: (_) => void 0,
  onSubmit: () => void 0,
  onError: () => void 0,
  onCancel: () => void 0,
  onDelete: () => void 0,
  initialValues: {},
})

export function useEditorContext<T extends FormValues>() {
  return useContext<EditorContext<T>>(EditorContext)
}
