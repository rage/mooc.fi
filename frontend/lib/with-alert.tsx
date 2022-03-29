import { useAlertContext } from "/contexts/AlertContext"

export default (Component: any) => (props: any) => {
  const { addAlert } = useAlertContext()

  return <Component {...props} addAlert={addAlert} />
}
