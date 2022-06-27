import { Alert } from "/contexts/AlertContext"
import { Breadcrumb } from "/contexts/BreadcrumbContext"

export interface AppState {
  user: {
    loggedIn: boolean
    logInOrOut: () => void
    admin: boolean
    validated: boolean
    currentUser: any
    updateUser: (user: any) => void
  }
  alerts: {
    alerts: Array<Alert>
    nextId: number
    addAlert: (alert: Alert) => void
    removeAlert: (alert: Alert) => void
  }
  breadcrumbs: {
    breadcrumbs: Array<Breadcrumb>
    setBreadcrumbs: (breadcrumbs: Array<Breadcrumb>) => void
  }
}
