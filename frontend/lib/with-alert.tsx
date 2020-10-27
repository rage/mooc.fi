import { useContext } from "react"
import AlertContext from "/contexes/AlertContext"

export default (Component: any) => (props: any) => {
  const { addAlert } = useContext(AlertContext)

  return <Component {...props} addAlert={addAlert} />
}
