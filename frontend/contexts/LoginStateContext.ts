import { createContext } from "react"

import { CurrentUserQuery } from "/graphql/generated"

export interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  admin: boolean
  currentUser?: CurrentUserQuery["currentUser"]
  updateUser: (data: {
    user: CurrentUserQuery["currentUser"]
    admin?: boolean
  }) => void
}

const LoginStateContext = createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
  admin: false,
  updateUser: (_) => {},
})

export default LoginStateContext
