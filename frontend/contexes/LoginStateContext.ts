import * as React from "react"
interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
}
const LoginStateContext = React.createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
})

export default LoginStateContext
