import { useCallback } from "react"

import { useRouter } from "next/router"

import { Alert, AlertTitle } from "@mui/material"

import { Alert as AlertType, useAlertContext } from "/contexts/AlertContext"

const Alerts = () => {
  const { alerts, removeAlert } = useAlertContext()
  const router = useRouter()
  const onRemoveAlert = useCallback(
    (alert: AlertType) => () => removeAlert(alert),
    [],
  )

  return (
    <>
      {alerts
        .filter((alert) => !alert.ignorePages?.includes(router.pathname))
        .map((alert) => (
          <Alert
            key={`alert-${alert.id}`}
            onClose={onRemoveAlert(alert)}
            severity={alert.severity ?? "info"}
          >
            {alert.title ? <AlertTitle>{alert.title}</AlertTitle> : null}
            {alert.message ?? alert.component}
          </Alert>
        ))}
    </>
  )
}

export default Alerts
