import React, { createContext, useContext, useEffect, useReducer } from "react"

import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

export interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  admin: boolean
  currentUser?: UserOverView_currentUser
  updateUser: (user: UserOverView_currentUser) => void
}

export const LoginStateContext = createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
  admin: false,
  updateUser: (_) => {},
})

export function useLoginStateContext() {
  return useContext(LoginStateContext)
}

const reducer = (state: LoginState, action: any) => {
  switch (action.type) {
    case "logInOrOut":
      return {
        ...state,
        loggedIn: !state.loggedIn,
      }
    case "updateUser":
      return {
        ...state,
        currentUser: action.payload.user,
        admin: action.payload.admin || false,
      }
    default:
      return state
  }
}

type ProviderProps = Omit<LoginState, "logInOrOut" | "updateUser"> & {
  children: JSX.Element
}

export const LoginStateProvider = React.memo(function LoginStateProvider({
  loggedIn,
  admin,
  currentUser,
  children,
}: ProviderProps) {
  const logInOrOut = () => dispatch({ type: "logInOrOut" })

  const updateUser = (user: any) =>
    dispatch({ type: "updateUser", payload: { user } })

  const [state, dispatch] = useReducer(reducer, {
    loggedIn,
    logInOrOut,
    admin,
    currentUser,
    updateUser,
  })

  useEffect(() => {
    if (currentUser !== state.currentUser) {
      dispatch({
        type: "updateUser",
        payload: { user: currentUser, admin },
      })
    }
  }, [currentUser])

  return (
    <LoginStateContext.Provider value={state}>
      {children}
    </LoginStateContext.Provider>
  )
})
