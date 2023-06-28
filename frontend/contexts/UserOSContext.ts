import { createContext } from "react"

import { UserOSType } from "/util/getUserOS"

interface UserOS {
  OS: UserOSType
  changeOS: (OS: UserOSType) => void
}
const UserOSContext = createContext<UserOS>({
  OS: "OS",
  changeOS: (OS: UserOSType) => console.log(OS),
})

export default UserOSContext
