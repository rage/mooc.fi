import * as React from "react"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

export interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  admin: boolean
  currentUser?: UserOverView_currentUser
  updateUser: (user: UserOverView_currentUser) => void
}

const LoginStateContext = React.createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
  admin: false,
  updateUser: (_) => {},
})

export default LoginStateContext
