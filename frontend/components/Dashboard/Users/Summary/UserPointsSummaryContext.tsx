import { createContext, useContext, useMemo } from "react"

import { ApolloError } from "@apollo/client"

import { SortOrder, UserCourseSummarySort } from "./types"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

export interface UserPointsSummaryContext {
  data: Array<UserCourseSummaryCoreFieldsFragment>
  sort: UserCourseSummarySort
  order: SortOrder
  onSortOrderToggle: () => void
  onCourseSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  sortOptions: Array<{ value: UserCourseSummarySort; label: string }>
  loading?: boolean
  error?: ApolloError
}

const UserPointsSummaryContextImpl = createContext<UserPointsSummaryContext>({
  data: [],
  sort: "course_name",
  order: "asc",
  onSortOrderToggle: () => {
    return
  },
  onCourseSortChange: () => {
    return
  },
  sortOptions: [],
})

export default UserPointsSummaryContextImpl

export function useUserPointsSummaryContext() {
  return useContext(UserPointsSummaryContextImpl)
}

export function useUserPointsSummaryContextCourseById(courseId: string) {
  const { data } = useUserPointsSummaryContext()

  return useMemo(
    () => data.find((course) => course.course?.id === courseId)!,
    [data, courseId],
  )
}

export function useUserPointsSummaryContextCourseBySlug(courseSlug: string) {
  const { data } = useUserPointsSummaryContext()

  return useMemo(
    () => data.find((course) => course.course?.slug === courseSlug)!,
    [data, courseSlug],
  )
}
