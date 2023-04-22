import ExerciseList from "../Exercise/ExerciseList"
import ProgressEntry from "../ProgressEntry"
import { CourseEntryCard } from "./common"

import { UserTierCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseTierEntryProps {
  data: UserTierCourseSummaryCoreFieldsFragment
}

export function CourseTierEntry({ data }: CourseTierEntryProps) {
  if (!data?.course) {
    return null
  }

  return (
    <CourseEntryCard course={data.course} hasCollapseButton>
      <ProgressEntry key={`${data.course.id}-progress`} data={data} />
      <ExerciseList key={`${data.course.id}-exercise-list`} data={data} />
    </CourseEntryCard>
  )
}
