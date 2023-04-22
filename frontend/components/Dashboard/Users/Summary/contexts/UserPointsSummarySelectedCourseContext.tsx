import { createContext, useContext } from "react"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
} from "/graphql/generated"

interface UserPointsSummarySelectedCourseContext {
  selected: UserCourseSummaryCourseFieldsFragment["slug"]
  setSelected: (slug: UserCourseSummaryCourseFieldsFragment["slug"]) => void
  selectedData?: UserCourseSummaryCoreFieldsFragment
}

const UserPointsSummarySelectedCourseContextImpl =
  createContext<UserPointsSummarySelectedCourseContext>({
    selected: "",
    setSelected: () => {
      return
    },
  })

export default UserPointsSummarySelectedCourseContextImpl

export function useUserPointsSummarySelectedCourseContext() {
  return useContext(UserPointsSummarySelectedCourseContextImpl)
}
