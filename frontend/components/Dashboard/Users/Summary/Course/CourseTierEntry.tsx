import {
  useUserPointsSummaryContextByCourseId,
  useUserPointsSummarySelectedCourseContext,
} from "../contexts"
import ExerciseList from "../Exercise/ExerciseList"
import { ProgressEntry } from "../Progress"
import { CourseEntryCard } from "./common"

interface CourseTierEntryProps {
  parentCourseId: string
  courseId: string
}

const tierToName: Record<number, string> = {
  1: "beginner",
  2: "intermediate",
  3: "advanced",
}

export function CourseTierEntry({
  parentCourseId,
  courseId,
}: CourseTierEntryProps) {
  const data = useUserPointsSummaryContextByCourseId(parentCourseId, courseId)
  const { loading } = useUserPointsSummarySelectedCourseContext()

  return (
    <CourseEntryCard
      course={data.course}
      id={tierToName[data.course.tier ?? 0]}
      hasCollapseButton
    >
      <ProgressEntry key={`${data.course.id}-progress`} data={data} />
      <ExerciseList
        key={`${data.course.id}-exercise-list`}
        data={data?.course?.exercises ?? []}
        loading={loading}
      />
    </CourseEntryCard>
  )
}
