import { useMemo } from "react"

import { sortBy } from "lodash"

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
      <ProgressEntry
        key={`${data.course.id}-progress`}
        course={data.course}
        userCourseProgress={data.user_course_progress}
        userCourseServiceProgresses={data.user_course_service_progresses}
      />
      <ExerciseList key={`${data.course.id}-exercise-list`} />
    </CourseEntryCard>
  )
}
