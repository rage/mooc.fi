import { useContext } from "react"

import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import { useRouter } from "next/router"

import AlertContext from "/contexts/AlertContext"

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext)
  const router = useRouter()

  return (
    <>
      {alerts
        .filter((alert) => !alert.ignorePages?.includes(router.pathname))
        .filter((alert) => alert.onlyPages?.includes(router.pathname))
        .map((alert, idx) => (
          <Alert
            key={`alert-${idx}`}
            onClose={() => removeAlert(alert)}
            severity={alert.severity || "info"}
          >
            {alert.title ? <AlertTitle>{alert.title}</AlertTitle> : null}
            {alert.message || alert.component}
          </Alert>
        ))}
    </>
  )
}

export default Alerts
