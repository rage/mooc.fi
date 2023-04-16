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
  logInOrOut: () => void
  admin: boolean
  currentUser?: UserDetailedFieldsFragment
  updateUser: (user: UpdateUserPayload) => void
}

export const LoginStateContext = createContext<LoginState>({
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

type ProviderProps = { value: Omit<LoginState, "logInOrOut" | "updateUser"> }

export const LoginStateProvider = React.memo(function LoginStateProvider({
  value,
  children,
}: React.PropsWithChildren<ProviderProps>) {
  console.log("LoginStateProvider", value)
  const { loggedIn, admin, currentUser } = value
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

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: state.loggedIn,
      logInOrOut,
      admin: state.admin,
      currentUser: state.currentUser,
      updateUser,
    }),
    [state.loggedIn, state.admin, state.currentUser],
  )

  return (
    <LoginStateContext.Provider value={loginStateContextValue}>
      {children}
    </LoginStateContext.Provider>
  )
})
