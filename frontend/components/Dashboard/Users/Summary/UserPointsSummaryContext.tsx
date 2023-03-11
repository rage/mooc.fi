import { createContext, useContext } from "react"

import { SortOrder, UserCourseSummarySort } from "./types"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

export interface UserPointsSummaryContext {
  data: Array<UserCourseSummaryCoreFieldsFragment>
  sort: UserCourseSummarySort
  order: SortOrder
  onSortOrderToggle: () => void
  onCourseSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  sortOptions: Array<{ value: UserCourseSummarySort; label: string }>
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

export function useUserPointsSummaryContextCourse(courseId: string) {
  const { data } = useUserPointsSummaryContext()

  return data.find((course) => course.course?.id === courseId)!
}
