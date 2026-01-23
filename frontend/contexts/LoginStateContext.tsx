import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

import {
  CurrentUserQuery,
  UserDetailedFieldsFragment,
} from "/graphql/generated"

type UpdateUserPayload = {
  user: CurrentUserQuery["currentUser"]
  admin?: boolean
}

export interface LoginState {
  loggedIn: boolean
  admin: boolean
  currentUser?: UserDetailedFieldsFragment
}

export interface LoginStateContextType extends LoginState {
  logInOrOut: () => void
  updateUser: (user: UpdateUserPayload) => void
}

export const LoginStateContext = createContext<LoginStateContextType>({
  loggedIn: false,
  logInOrOut: () => void 0,
  currentUser: undefined,
  admin: false,
  updateUser: (_) => void 0,
})

export function useLoginStateContext() {
  return useContext(LoginStateContext)
}

const reducer = (state: LoginState, action: any) => {
  switch (action.type) {
    case "sync":
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        admin: action.payload.admin,
        currentUser: action.payload.currentUser,
      }
    case "logInOrOut":
      return {
        ...state,
        admin: state.loggedIn ? false : state.admin,
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

type ProviderProps = { value: Omit<LoginState, "logInOrOut" | "updateUser"> }

export const LoginStateProvider = React.memo(function LoginStateProvider({
  value,
  children,
}: React.PropsWithChildren<ProviderProps>) {
  const { loggedIn, admin, currentUser } = value
  const logInOrOut = () => dispatch({ type: "logInOrOut" })

  const updateUser = (user: any) =>
    dispatch({ type: "updateUser", payload: { user } })

  const [state, dispatch] = useReducer(reducer, {
    loggedIn,
    admin,
    currentUser,
  })

  useEffect(() => {
    dispatch({
      type: "sync",
      payload: { loggedIn, admin, currentUser },
    })
  }, [loggedIn, admin, currentUser])

  const loginStateContextValue = useMemo(
    () => ({
      ...state,
      logInOrOut,
      updateUser,
    }),
    [state],
  )

  return (
    <LoginStateContext.Provider value={loginStateContextValue}>
      {children}
    </LoginStateContext.Provider>
  )
})
