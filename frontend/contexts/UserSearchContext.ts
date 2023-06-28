import { createContext } from "react"

import {
  UserCoreFieldsFragment,
  UserSearchField,
  UserSearchMetaFieldsFragment,
  UserSearchSubscriptionVariables,
} from "/graphql/generated"

export interface UserSearchContext {
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

const Nop = () => {
  /* */
}

const UserSearchContextImpl = createContext<UserSearchContext>({
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
  setPage: Nop,
  setSearchVariables: Nop,
  setRowsPerPage: Nop,
  setSearch: Nop,
  setFields: Nop,
  resetResults: Nop,
  setResults: Nop,
})

export default UserSearchContextImpl
