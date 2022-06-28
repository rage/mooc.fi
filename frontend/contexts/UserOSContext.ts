import { createContext } from "react"

import { userOsType } from "/util/getUserOS"

interface UserOS {
  OS: userOsType
  changeOS: (OS: userOsType) => void
}
const UserOSContext = createContext<UserOS>({
  OS: "OS",
  changeOS: (OS: userOsType) => console.log(OS),
})

export default UserOSContext
