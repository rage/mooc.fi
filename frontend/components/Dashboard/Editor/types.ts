import { AlertColor } from "@mui/material"

export interface FormStatus {
  message: string | null
  severity?: AlertColor
}

export interface FormValues {
  id?: string | null
  [key: string]: any
}
