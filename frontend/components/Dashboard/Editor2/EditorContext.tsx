import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { FormStatus } from "/components/Dashboard/Editor2/types"

interface EditorContext {
  status: FormStatus
  setStatus: Dispatch<SetStateAction<FormStatus>>
}

const EditorContext = createContext<EditorContext>({
  status: { message: null },
  setStatus: (_: any) => {},
})

export default EditorContext

export function useEditorContext() {
  return useContext(EditorContext)
}
