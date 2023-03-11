import { useMemo } from "react"

import { sortBy } from "lodash"

import ExerciseList from "../ExerciseList"
import ProgressEntry from "../ProgressEntry"
import { CourseEntryCard } from "./common"

import { UserTierCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseTierEntryProps {
  data: UserTierCourseSummaryCoreFieldsFragment
}

export function CourseTierEntry({ data }: CourseTierEntryProps) {
  const exercisesWithCompletions = useMemo(
    () =>
      sortBy(
        (data?.course.exercises ?? []).map((exercise) => ({
          ...exercise,
          exercise_completions: (data?.exercise_completions ?? []).filter(
            (ec) => ec?.exercise_id === exercise.id,
          ),
        })),
        ["part", "section", "name"],
      ),
    [data],
  )

  if (!data?.course) {
    return null
  }

  return (
    <CourseEntryCard course={data.course}>
      <ProgressEntry
        key={`${data.course.id}-progress`}
        course={data.course}
        userCourseProgress={data.user_course_progress}
        userCourseServiceProgresses={data.user_course_service_progresses}
      />
      <ExerciseList
        key={`${data.course.id}-exercise-list`}
        exercises={exercisesWithCompletions}
      />
    </CourseEntryCard>
  )
}
