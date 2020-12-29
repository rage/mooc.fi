import { createContext, Dispatch, SetStateAction } from "react"
import { FormStatus } from "/components/Dashboard/Editor2/types"

interface FormContext {
  status: FormStatus
  setStatus: Dispatch<SetStateAction<FormStatus>>
}

export default createContext<FormContext>({
  status: { message: null },
  setStatus: (_: any) => {},
})
