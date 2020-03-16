import { createContext } from "react"

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

export default createContext<AlertState>({
  alerts: [],
  addAlert: (_: Alert) => {},
  removeAlert: (_: Alert) => {},
})
