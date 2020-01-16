import * as React from "react"
import { userOsType } from "/util/getUserOS"
interface UserOS {
  OS: userOsType
  changeOS: (OS: userOsType) => void
}
const UserOSContext = React.createContext<UserOS>({
  OS: "OS",
  changeOS: (OS: userOsType) => console.log(OS),
})

export default UserOSContext
