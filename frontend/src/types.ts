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
    data: Alert[]
    nextId: number
  }
  breadcrumbs: {
    data: Breadcrumb[]
  }
}
