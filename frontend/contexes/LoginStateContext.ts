import * as React from "react"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"
interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  currentUser?: UserOverView_currentUser
}
const LoginStateContext = React.createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
})

export default LoginStateContext
