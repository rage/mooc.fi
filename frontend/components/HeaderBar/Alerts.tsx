import { useRouter } from "next/router"

import { Alert, AlertTitle } from "@mui/material"
import { useEventCallback } from "@mui/material/utils"

import { Alert as AlertType, useAlertContext } from "/contexts/AlertContext"

const Alerts = () => {
  const { alerts, removeAlert } = useAlertContext()
  const router = useRouter()
  const onRemoveAlert = useEventCallback(
    (alert: AlertType) => () => removeAlert(alert),
  )

  return (
    <div id="alerts">
      {alerts
        .filter((alert) => !alert.ignorePages?.includes(router.pathname))
        .map((alert) => (
          <Alert
            key={alert.id}
            onClose={onRemoveAlert(alert)}
            severity={alert.severity ?? "info"}
          >
            {alert.title ? <AlertTitle>{alert.title}</AlertTitle> : null}
            {alert.message ?? alert.component}
          </Alert>
        ))}
    </div>
  )
}

export default Alerts
