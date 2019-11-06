import * as React from "react"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

interface UserDetail {
  admin: boolean
  currentUser?: UserOverView_currentUser
}

const UserDetailContext = React.createContext<UserDetail>({
  admin: false,
  currentUser: undefined,
})

export default UserDetailContext
