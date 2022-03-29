import React, { createContext, useContext, useReducer } from "react"

export interface Alert {
  id?: number
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
  nextAlertId: number
}

export const AlertContext = createContext<AlertState>({
  alerts: [],
  addAlert: (_: Alert) => {},
  removeAlert: (_: Alert) => {},
  nextAlertId: 0,
})

export function useAlertContext() {
  return useContext(AlertContext)
}

const reducer = (state: AlertState, action: any) => {
  switch (action.type) {
    case "addAlert":
      const nextAlertId = state.nextAlertId + 1
      return {
        ...state,
        alerts: [...state.alerts, { ...action.payload, id: nextAlertId }],
        nextAlertId,
      }
    case "removeAlert":
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      }
    default:
      return state
  }
}

export const AlertProvider = React.memo(function AlertProvider({
  children,
}: {
  children: JSX.Element
}) {
  const addAlert = (alert: Alert) =>
    dispatch({ type: "addAlert", payload: alert })

  const removeAlert = (alert: Alert) =>
    dispatch({ type: "removeAlert", payload: alert })

  const [state, dispatch] = useReducer(reducer, {
    alerts: [] as Array<Alert>,
    addAlert,
    removeAlert,
    nextAlertId: 0,
  })

  return <AlertContext.Provider value={state}>{children}</AlertContext.Provider>
})
