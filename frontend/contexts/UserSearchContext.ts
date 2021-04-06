import { createContext } from "react"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"

export interface SearchVariables {
  search: string
  cursor?: string
  first?: number
  last?: number
  skip?: number
  after?: string | null
  before?: string | null
}

interface UserSearchContext {
  data: UserDetailsContains
  loading: boolean
  page: number
  rowsPerPage: number
  searchVariables: SearchVariables
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSearchVariables: React.Dispatch<React.SetStateAction<any>>
  setRowsPerPage: React.Dispatch<React.SetStateAction<any>>
}

export default createContext<UserSearchContext>({
  data: {} as UserDetailsContains,
  loading: false,
  page: 0,
  rowsPerPage: 10,
  searchVariables: {
    search: "",
  },
  setPage: () => {},
  setSearchVariables: () => {},
  setRowsPerPage: () => {},
})
