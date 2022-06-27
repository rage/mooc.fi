import { PropsWithChildren, useCallback, useEffect, useReducer } from "react"

import { ConfirmProvider } from "material-ui-confirm"

import AlertContext, { Alert } from "/contexts/AlertContext"
import { Breadcrumb, BreadcrumbContext } from "/contexts/BreadcrumbContext"
import LoginStateContext from "/contexts/LoginStateContext"
import {
  AlertActionType,
  BreadcrumbActionType,
  rootReducer,
  UserActionType,
} from "/state"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

interface AppContextProps {
  signedIn: boolean
  admin: boolean
  validated?: boolean
  currentUser: UserOverView_currentUser
}

export function AppContextProvider({
  signedIn,
  admin,
  currentUser,
  validated,
  children,
}: PropsWithChildren<AppContextProps>) {
  const logInOrOut = useCallback(
    () => dispatch({ type: UserActionType.LogInOrOut }),
    [],
  )

  const updateUser = useCallback(
    (payload: { user: UserOverView_currentUser; admin?: boolean }) =>
      dispatch({ type: UserActionType.UpdateUser, payload }),
    [],
  )

  const setBreadcrumbs = useCallback(
    (breadcrumbs: Array<Breadcrumb>) =>
      dispatch({
        type: BreadcrumbActionType.SetBreadcrumbs,
        payload: breadcrumbs,
      }),
    [],
  )

  const addAlert = useCallback(
    (alert: Alert) =>
      dispatch({ type: AlertActionType.AddAlert, payload: alert }),
    [],
  )
  const removeAlert = useCallback(
    (alert: Alert) =>
      dispatch({ type: AlertActionType.RemoveAlert, payload: alert }),
    [],
  )

  const [state, dispatch] = useReducer(rootReducer, {
    user: {
      loggedIn: signedIn,
      logInOrOut,
      admin,
      validated: validated ?? false,
      currentUser,
      updateUser,
    },
    alerts: {
      alerts: [],
      nextId: 0,
      addAlert,
      removeAlert,
    },
    breadcrumbs: {
      breadcrumbs: [],
      setBreadcrumbs,
    },
  })

  useEffect(() => {
    // check if added alert has a timeout and set it to remove itself
    const newestAlert = state.alerts.alerts.slice(-1)[0]

    let timeout: NodeJS.Timeout

    if (newestAlert?.timeout) {
      timeout = setTimeout(() => {
        removeAlert(newestAlert)
      }, newestAlert.timeout)
    }

    return () => timeout && clearTimeout(timeout)
  }, [state.alerts.alerts])

  useEffect(() => {
    // received different currentUser, update context state
    if (currentUser !== state.user.currentUser) {
      dispatch({
        type: UserActionType.UpdateUser,
        payload: { user: currentUser, admin },
      })
    }
  }, [currentUser])

  return (
    <LoginStateContext.Provider value={state.user}>
      <ConfirmProvider>
        <BreadcrumbContext.Provider value={state.breadcrumbs}>
          <AlertContext.Provider value={state.alerts}>
            {children}
          </AlertContext.Provider>
        </BreadcrumbContext.Provider>
      </ConfirmProvider>
    </LoginStateContext.Provider>
  )
}
