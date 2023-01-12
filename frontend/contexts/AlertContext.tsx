import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

export interface Alert {
  id?: number
  title?: string
  message?: string
  timeout?: number
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
      const nextAlertId = state.nextAlertId
      return {
        ...state,
        alerts: [...state.alerts, { ...action.payload, id: nextAlertId }],
        nextAlertId: nextAlertId + 1,
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
  const addAlert = useCallback(
    (alert: Alert) => dispatch({ type: "addAlert", payload: alert }),
    [],
  )

  const removeAlert = useCallback(
    (alert: Alert) => dispatch({ type: "removeAlert", payload: alert }),
    [],
  )

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

  useEffect(() => {
    const lastAlertId = state.nextAlertId - 1
    if (lastAlertId < 0) return () => void 0
    const newestAlert = state.alerts.filter(
      (alert) => alert.id === lastAlertId,
    )[0]

    let timeout: NodeJS.Timeout

    if (newestAlert.timeout) {
      timeout = setTimeout(() => {
        removeAlert(newestAlert)
      }, newestAlert.timeout)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [state.nextAlertId])

  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
    </AlertContext.Provider>
  )
})
