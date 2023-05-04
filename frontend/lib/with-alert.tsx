import { useAlertContext } from "/contexts/AlertContext"

const withAlert = (Component: any) => (props: any) => {
  const { addAlert } = useAlertContext()

  return <Component {...props} addAlert={addAlert} />
}

export default withAlert
