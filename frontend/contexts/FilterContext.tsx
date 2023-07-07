import React from "react"

import { ApolloError } from "@apollo/client"

import {
  CourseStatus,
  EditorCoursesQuery,
  HandlerCoursesQuery,
} from "/graphql/generated"

export interface SearchVariables {
  search: string | undefined
  hidden?: boolean
  handledBy?: string | null
  status?: Array<CourseStatus>
}
export interface FilterContext {
  searchVariables: SearchVariables
  setSearchVariables: React.Dispatch<React.SetStateAction<SearchVariables>>
  loading: boolean
  error?: ApolloError
  coursesData?: EditorCoursesQuery
  handlerCoursesData?: HandlerCoursesQuery
  onStatusClick?: (value: CourseStatus | null) => (_: any) => void
}

export const FilterContext = React.createContext<FilterContext>({
  searchVariables: {} as SearchVariables,
  setSearchVariables: () => void 0,
  loading: false,
})

export const useFilterContext = () => React.useContext(FilterContext)
