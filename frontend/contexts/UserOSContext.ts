import { userOsType } from "/util/getUserOS"
import { createContext } from "react"

interface UserOS {
  OS: userOsType
  changeOS: (OS: userOsType) => void
}
const UserOSContext = createContext<UserOS>({
  OS: "OS",
  changeOS: (OS: userOsType) => console.log(OS),
})

export default UserOSContext
