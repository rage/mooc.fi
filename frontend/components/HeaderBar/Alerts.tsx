import { useContext } from "react"
import AlertContext from "../../contexts/AlertContext"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import { useRouter } from "next/router"

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertContext)
  const router = useRouter()

  return (
    <>
      {alerts
        .filter((alert) => !alert.ignorePages?.includes(router.pathname))
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
