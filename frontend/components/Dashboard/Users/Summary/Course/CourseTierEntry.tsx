import ExerciseList from "../Exercise/ExerciseList"
import { ProgressEntry } from "../Progress"

import { UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment } from "/graphql/generated"

interface CourseTierEntryProps {
  data: UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  loading?: boolean
}

export default function CourseTierEntry({
  data,
  loading,
}: CourseTierEntryProps) {
  return (
    <>
      <ProgressEntry key={`${data.course.id}-progress`} data={data} />
      <ExerciseList
        key={`${data.course.id}-exercise-list`}
        data={data?.course?.exercises ?? []}
        loading={loading}
      />
    </>
  )
}
