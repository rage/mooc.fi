import { createContext } from "react"

import {
  UserDetailsContainsQuery,
  UserDetailsContainsQueryVariables,
} from "/graphql/generated"

interface UserSearchContext {
  data?: UserDetailsContainsQuery
  loading: boolean
  page: number
  rowsPerPage: number
  search: string
  searchVariables: UserDetailsContainsQueryVariables
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSearchVariables: React.Dispatch<
    React.SetStateAction<UserDetailsContainsQueryVariables>
  >
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default createContext<UserSearchContext>({
  data: {} as UserDetailsContainsQuery,
  loading: false,
  page: 0,
  rowsPerPage: 10,
  searchVariables: {
    search: "",
  },
  search: "",
  setPage: () => {},
  setSearchVariables: () => {},
  setRowsPerPage: () => {},
  setSearch: () => {},
})
