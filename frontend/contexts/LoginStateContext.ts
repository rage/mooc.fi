import { createContext } from "react"

import { UserOverviewFieldsFragment } from "/graphql/generated"

export interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  admin: boolean
  currentUser?: UserOverviewFieldsFragment
  updateUser: (user: UserOverviewFieldsFragment) => void
}

const LoginStateContext = createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
  admin: false,
  updateUser: (_) => {},
})

export default LoginStateContext
