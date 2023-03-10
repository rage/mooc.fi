import { createContext, useContext } from "react"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

const UserPointsSummaryContext = createContext<
  Array<UserCourseSummaryCoreFieldsFragment>
>([])

export default UserPointsSummaryContext

export function useUserPointsSummaryContext() {
  return useContext(UserPointsSummaryContext)
}

export function useUserPointsSummaryContextCourse(courseId: string) {
  const data = useUserPointsSummaryContext()

  return data.find((course) => course.course?.id === courseId)!
}
