import { createContext } from "react"

import {
  UserCoreFieldsFragment,
  UserDetailsContainsQueryVariables,
  UserSearchMetaFieldsFragment,
} from "/graphql/generated"

interface UserSearchContext {
  data: Array<UserCoreFieldsFragment>
  meta: UserSearchMetaFieldsFragment
  totalMeta: Array<UserSearchMetaFieldsFragment>
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
  resetResults: () => void
}

export default createContext<UserSearchContext>({
  data: [] as Array<UserCoreFieldsFragment>,
  meta: {} as UserSearchMetaFieldsFragment,
  totalMeta: [] as Array<UserSearchMetaFieldsFragment>,
  loading: false,
  page: 0,
  rowsPerPage: 10,
  searchVariables: {
    search: "",
  },
  search: "",
  setPage: () => void 0,
  setSearchVariables: () => void 0,
  setRowsPerPage: () => void 0,
  setSearch: () => void 0,
  resetResults: () => void 0,
})
