import React, { createContext, useContext, useMemo, useReducer } from "react"

import { useEventCallback } from "@mui/material/utils"

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
  addAlert: (_: Alert) => void 0,
  removeAlert: (_: Alert) => void 0,
  nextAlertId: 0,
})

export function useAlertContext() {
  return useContext(AlertContext)
}

type AlertAction =
  | {
      type: "addAlert"
      payload: Alert
    }
  | {
      type: "removeAlert"
      payload: Alert
    }

const reducer = (state: AlertState, action: AlertAction) => {
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
        alerts: state.alerts.filter((alert) => alert.id !== action.payload.id),
      }
    default:
      return state
  }
}

export const AlertProvider = React.memo(function AlertProvider({
  children,
}: React.PropsWithChildren) {
  const addAlert = useEventCallback((alert: Alert) => {
    dispatch({ type: "addAlert", payload: alert })
  })

  const removeAlert = useEventCallback((alert: Alert) => {
    dispatch({ type: "removeAlert", payload: alert })
  })

  const [state, dispatch] = useReducer(reducer, {
    alerts: [] as Array<Alert>,
    addAlert,
    removeAlert,
    nextAlertId: 0,
  })

  const alertContextValue = useMemo(
    () => ({
      alerts: state.alerts,
      addAlert,
      removeAlert,
      nextAlertId: state.nextAlertId,
    }),
    [state.alerts, state.nextAlertId],
  )

  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
    </AlertContext.Provider>
  )
})
