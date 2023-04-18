import { createContext } from "react"

import {
  UserCoreFieldsFragment,
  UserSearchField,
  UserSearchMetaFieldsFragment,
  UserSearchSubscriptionVariables,
} from "/graphql/generated"

interface UserSearchContext {
  data: Array<UserCoreFieldsFragment>
  meta: UserSearchMetaFieldsFragment
  totalMeta: Array<UserSearchMetaFieldsFragment>
  loading: boolean
  page: number
  rowsPerPage: number
  search: string
  fields?: UserSearchField[]
  setFields: React.Dispatch<React.SetStateAction<UserSearchField[] | undefined>>
  searchVariables: UserSearchSubscriptionVariables
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSearchVariables: React.Dispatch<
    React.SetStateAction<UserSearchSubscriptionVariables>
  >
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  resetResults: () => void
  setResults: React.Dispatch<React.SetStateAction<UserSearchResults>>
}

export interface UserSearchResults {
  data: Array<UserCoreFieldsFragment>
  meta: UserSearchMetaFieldsFragment
  totalMeta: Array<UserSearchMetaFieldsFragment>
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
  setFields: () => void 0,
  resetResults: () => void 0,
  setResults: () => void 0,
})
