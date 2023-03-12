import React, { useCallback, useMemo } from "react"

import { sortBy } from "lodash"

import { CardContent, Paper, Skeleton } from "@mui/material"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "../CollapseContext"
import Completion from "../Completion"
import ExerciseList from "../ExerciseList"
import ProgressEntry from "../ProgressEntry"
import RelevantDates from "../RelevantDates"
import TierExerciseList from "../TierExerciseList"
import TotalProgressEntry from "../TotalProgressEntry"
import { CourseEntryCard, CourseEntryCardBase } from "./common"
import { CourseTierEntry } from "./CourseTierEntry"
import { CardTitle } from "/components/Text/headers"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseEntryProps {
  data: UserCourseSummaryCoreFieldsFragment
}

const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

export const SkeletonCourseEntry = () => (
  <CourseEntryCardBase>
    <CardTitle>
      <Skeleton />
    </CardTitle>
    <CardContent>
      <CourseEntryPartSkeleton />
    </CardContent>
  </CourseEntryCardBase>
)

export function CourseEntry({ data }: CourseEntryProps) {
  const hasTierSummaries = useMemo(
    () => (data.tier_summaries?.length ?? 0) > 0,
    [data],
  )
  const { dispatch } = useCollapseContext()

  // TODO: subheaders for parts?

  // @ts-ignore: not used for now
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.COURSE,
        course: data?.course?.id ?? "_",
      }),
    [data?.course?.id, dispatch],
  )

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

  if (!data.course) {
    return null
  }

  return (
    <CourseEntryCard course={data?.course} hasCopyButton>
      <RelevantDates data={data} />
      <Completion
        key={`${data.course.id}-completion`}
        course={data.course}
        completion={data.completion}
      />
      {hasTierSummaries ? (
        <>
          {data.user_course_progress?.extra && (
            <>
              <TotalProgressEntry
                key={`${data.course.id}-total-progress`}
                data={data.user_course_progress.extra}
              />
              <TierExerciseList
                data={data.user_course_progress?.extra.exercises}
              />
            </>
          )}
          {sortBy(
            data.tier_summaries ?? [],
            (tierEntry) => tierEntry.course?.tier,
          ).map((tierEntry) => (
            <CourseTierEntry key={tierEntry.course?.id} data={tierEntry} />
          ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </CourseEntryCard>
  )
}
