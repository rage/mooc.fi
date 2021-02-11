import { createContext, useContext } from "react"

export interface Alert {
  title?: string
  message?: string
  component?: JSX.Element
  severity?: "error" | "warning" | "info" | "success"
  ignorePages?: string[]
}

export interface AlertState {
  alerts: Alert[]
  addAlert: (alert: Alert) => void
  removeAlert: (alert: Alert) => void
}

const AlertContext = createContext<AlertState>({
  alerts: [],
  addAlert: (_: Alert) => {},
  removeAlert: (_: Alert) => {},
})

export default AlertContext

export function useAlertContext() {
  return useContext(AlertContext)
}
