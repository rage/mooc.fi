import { createContext, useContext } from "react"

import { CourseListEntry, SortOrder, UserCourseSummarySort } from "../types"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

interface UserPointsSummarySelectedCourseContext {
  courses: Array<CourseListEntry>
  selected: UserCourseSummaryCourseFieldsFragment["slug"]
  setSelected: (slug: UserCourseSummaryCourseFieldsFragment["slug"]) => void
  sort: UserCourseSummarySort
  order: SortOrder
  onSortOrderToggle: () => void
  onCourseSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  sortOptions: Array<{ value: UserCourseSummarySort; label: string }>
  loading?: boolean
}

const UserPointsSummarySelectedCourseContextImpl =
  createContext<UserPointsSummarySelectedCourseContext>({
    courses: [],
    selected: "",
    setSelected: () => {
      return
    },
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

export default UserPointsSummarySelectedCourseContextImpl

export function useUserPointsSummarySelectedCourseContext() {
  return useContext(UserPointsSummarySelectedCourseContextImpl)
}
