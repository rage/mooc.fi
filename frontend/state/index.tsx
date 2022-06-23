import { Alert } from "/contexts/AlertContext"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import { AppState } from "/src/types"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"
import combineReducers from "/util/combineReducers"
import { omit } from "lodash"

const isNewAlert = (alert: Alert, alerts: Alert[]) => {
  const existingAlerts = alerts.map((a) =>
    JSON.stringify(omit(a, "id"), null, 2),
  )

  return !existingAlerts.includes(JSON.stringify(alert, null, 2))
}

export const enum AlertActionType {
  "AddAlert" = "addAlert",
  "RemoveAlert" = "removeAlert",
}
export const enum BreadcrumbActionType {
  "SetBreadcrumbs" = "setBreadcrumbs",
}
export const enum UserActionType {
  "UpdateUser" = "updateUser",
  "LogInOrOut" = "logInOrOut",
}

const alertReducer = (state: AppState["alerts"], action: AlertAction) => {
  switch (action.type) {
    case "addAlert":
      if (!isNewAlert(action.payload, state.data)) {
        return state
      }

      const nextId = state.nextId + 1
      const newAlert = { ...action.payload, id: nextId }

      return {
        ...state,
        data: [...state.data, newAlert],
        nextId,
      }
    case "removeAlert":
      return {
        ...state,
        data: state.data.filter((alert) => alert.id !== action.payload.id),
      }
    default:
      return state
  }
}

const breadcrumbReducer = (
  state: AppState["breadcrumbs"],
  action: BreadcrumbAction,
) => {
  switch (action.type) {
    case "setBreadcrumbs":
      return {
        ...state,
        data: action.payload,
      }
    default:
      return state
  }
}

const userReducer = (state: AppState["user"], action: UserAction) => {
  switch (action.type) {
    case "updateUser":
      return {
        ...state,
        currentUser: action.payload.user,
        admin: action.payload.admin || false,
      }
    case "logInOrOut":
      return {
        ...state,
        loggedIn: !state.loggedIn,
      }
    default:
      return state
  }
}

export type AlertAction = {
  type: AlertActionType
  payload: Alert
}
export type BreadcrumbAction = {
  type: BreadcrumbActionType
  payload: Array<Breadcrumb>
}
export type UserAction =
  | {
      type: UserActionType.UpdateUser
      payload: {
        user: UserOverView_currentUser
        admin?: boolean
      }
    }
  | {
      type: UserActionType.LogInOrOut
    }

export type AppAction = AlertAction | BreadcrumbAction | UserAction
export type AppActionMap = {
  alerts: AlertAction
  breadcrumbs: BreadcrumbAction
  user: UserAction
}

export const rootReducer = combineReducers<AppState, AppActionMap>({
  alerts: alertReducer,
  breadcrumbs: breadcrumbReducer,
  user: userReducer,
})
