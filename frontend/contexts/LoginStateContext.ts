import { createContext } from "react"

import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

interface UpdateUserArguments {
  user: UserOverView_currentUser
  admin?: boolean
}
export interface LoginState {
  loggedIn: boolean
  logInOrOut: () => void
  admin: boolean
  currentUser?: UserOverView_currentUser
  updateUser: (data: UpdateUserArguments) => void
}

const LoginStateContext = createContext<LoginState>({
  loggedIn: false,
  logInOrOut: () => {},
  currentUser: undefined,
  admin: false,
  updateUser: (_) => {},
})

export default LoginStateContext
