import CourseEntry from "./CourseEntry"
import { sortBy } from "lodash";
import { CourseStatistics_user_course_statistics } from "/static/types/generated/CourseStatistics";

interface UserPointsListProps {
  data: CourseStatistics_user_course_statistics[]
}

export default function UserPointsList({ data }: UserPointsListProps) {
  return (
    <>
      {sortBy(
        data,
        stats => stats?.course?.name
      ).map((entry) => (
        <CourseEntry
          key={entry.course?.id ?? Math.random() * 9999}
          data={entry}
        />
      ))}
  </>
  )
}