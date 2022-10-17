import React from "react"

import { ApolloError } from "@apollo/client"

import {
  CourseStatus,
  EditorCoursesQuery,
  EditorCoursesQueryVariables,
  HandlerCoursesQuery,
} from "/graphql/generated"

export interface FilterContext {
  searchVariables: EditorCoursesQueryVariables
  setSearchVariables: React.Dispatch<
    React.SetStateAction<EditorCoursesQueryVariables>
  >
  loading: boolean
  error?: ApolloError
  coursesData?: EditorCoursesQuery
  handlerCoursesData?: HandlerCoursesQuery
  onStatusClick?: (value: CourseStatus | null) => (_: any) => void
}

export const FilterContext = React.createContext<FilterContext>({
  searchVariables: {},
  setSearchVariables: () => {},
  loading: false,
})

export const useFilterContext = () => React.useContext(FilterContext)
