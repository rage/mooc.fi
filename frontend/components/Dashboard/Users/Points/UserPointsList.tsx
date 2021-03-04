import CourseEntry from "./CourseEntry"
import { sortBy } from "lodash"
import { UserSummary_user_course_statistics } from "/static/types/generated/UserSummary"

interface UserPointsListProps {
  data?: UserSummary_user_course_statistics[]
}

export default function UserPointsList({ data }: UserPointsListProps) {
  if (!data) {
    return (
      <>
        <CourseEntry key="skeleton-course-1" />
        <CourseEntry key="skeleton-course-2" />
        <CourseEntry key="skeleton-course-3" />
      </>
    )
  }
  return (
    <>
      {data.length === 0 ? <div>No data</div> : null}
      {sortBy(data, (stats) => stats?.course?.name).map((entry) => (
        <CourseEntry
          key={entry.course?.id ?? Math.random() * 9999}
          data={entry}
        />
      ))}
    </>
  )
}
