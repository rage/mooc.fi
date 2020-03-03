import { createContext } from "react"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"

interface UserSearchContext {
  data: UserDetailsContains
  loadData: Function
  loading: boolean
  handleChangeRowsPerPage: ({ eventValue }: { eventValue: string }) => void
  page: number
  rowsPerPage: number
  searchText: string
  setPage: React.Dispatch<React.SetStateAction<number>>
  // updateRoute: (_: string, __: number, ___: number) => void
  setSearchVariables: React.Dispatch<React.SetStateAction<any>>
}

export default createContext<UserSearchContext>({
  data: {} as UserDetailsContains,
  loadData: () => {},
  loading: false,
  handleChangeRowsPerPage: (_: any) => {},
  page: 0,
  rowsPerPage: 10,
  searchText: "",
  setPage: () => {},
  // updateRoute: (_: string, __: number, ___: number) => {},
  setSearchVariables: () => {},
})
