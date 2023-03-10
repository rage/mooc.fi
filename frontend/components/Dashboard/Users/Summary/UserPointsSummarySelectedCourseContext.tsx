import { createContext, useContext } from "react"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

interface UserPointsSummarySelectedCourseContext {
  selected: UserCourseSummaryCourseFieldsFragment["id"]
  setSelected: (id: UserCourseSummaryCourseFieldsFragment["slug"]) => void
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
