import AlertContext from "/contexts/AlertContext"
import { useContext } from "react"

export default (Component: any) => (props: any) => {
  const { addAlert } = useContext(AlertContext)

  return <Component {...props} addAlert={addAlert} />
}
