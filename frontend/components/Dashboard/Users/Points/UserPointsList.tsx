import CourseEntry from "./CourseEntry"
import { sortBy } from "lodash"
import { UserSummary_user_course_statistics } from "/static/types/generated/UserSummary"

interface UserPointsListProps {
  data?: UserSummary_user_course_statistics[]
  search?: string
}

export default function UserPointsList({ data, search }: UserPointsListProps) {
  if (!data) {
    return (
      <>
        <CourseEntry key="skeleton-course-1" />
        <CourseEntry key="skeleton-course-2" />
        <CourseEntry key="skeleton-course-3" />
      </>
    )
  }

  // TODO: add search from other fields?
  const filteredData =
    search && search !== ""
      ? data.filter((stats) =>
          stats?.course?.name
            .trim()
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
        )
      : data

  return (
    <>
      {filteredData.length === 0 ? <div>No data</div> : null}
      {sortBy(filteredData, (stats) => stats?.course?.name).map((entry) => (
        <CourseEntry
          key={entry.course?.id ?? Math.random() * 9999}
          data={entry}
        />
      ))}
    </>
  )
}
