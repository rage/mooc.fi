import { Card, CardContent, Collapse, Paper, Skeleton } from "@material-ui/core"
import { CardTitle } from "/components/Text/headers"
import styled from "@emotion/styled"
import {
  UserSummary_user_course_statistics,
  UserSummary_user_course_statistics_exercise_completions,
} from "/static/types/generated/UserSummary"
import { sortBy } from "lodash"
import React from "react"
import ExerciseList from "/components/Dashboard/Users/Points/ExerciseList"
import notEmpty from "/util/notEmpty"
import {
  useCollapseContext,
  ActionType,
  CollapsablePart,
} from "/contexes/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import Completion from "/components/Dashboard/Users/Points/Completion"
import ProgressEntry from "/components/Dashboard/Users/Points/ProgressEntry"

interface CourseEntryProps {
  data?: UserSummary_user_course_statistics
}

const CourseEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

CourseEntryCard.defaultProps = {
  elevation: 4,
}

const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

const CourseEntryCardSkeleton = () => (
  <CourseEntryCard>
    <CardTitle>
      <CardContent>
        <CourseEntryPartSkeleton />
        <CourseEntryPartSkeleton />
        <CourseEntryPartSkeleton />
      </CardContent>
    </CardTitle>
  </CourseEntryCard>
)
function CourseEntry({ data }: CourseEntryProps) {
  const { state, dispatch } = useCollapseContext()

  // @ts-ignore: not used
  const exercisesPerPart =
    data?.exercise_completions
      ?.filter(notEmpty)
      .reduce<
        Record<
          number,
          UserSummary_user_course_statistics_exercise_completions[]
        >
      >(
        (acc, curr) => ({
          ...acc,
          [curr.exercise?.part ?? 0]: sortBy(
            (acc[curr.exercise?.part ?? 0] ?? []).concat(curr),
            (ec) => ec.exercise?.section,
          ),
        }),
        {},
      ) ?? {}

  if (!data) {
    return <CourseEntryCardSkeleton />
  }

  if (!data.course) {
    return null
  }

  const isOpen = state[data?.course?.id ?? "_"]?.open
  // TODO: subheaders for parts?

  return (
    <CourseEntryCard>
      <CardTitle variant="h3">
        {data?.course?.name}
        <CollapseButton
          open={isOpen}
          onClick={() =>
            dispatch({
              type: ActionType.TOGGLE,
              collapsable: CollapsablePart.COURSE,
              course: data?.course?.id ?? "_",
            })
          }
        />
      </CardTitle>
      <Collapse in={isOpen} unmountOnExit>
        <CardContent>
          <Completion
            course={data.course}
            completion={data.completion ?? undefined}
          />
          <ProgressEntry
            course={data.course}
            userCourseProgress={data.user_course_progress}
            userCourseServiceProgresses={data.user_course_service_progresses?.filter(
              notEmpty,
            )}
          />
          <ExerciseList
            exerciseCompletions={sortBy(
              (data.exercise_completions ?? []).filter(notEmpty),
              ["exercise.part", "exercise.section", "exercise.name"],
            )}
          />
        </CardContent>
      </Collapse>
    </CourseEntryCard>
  )
}

export default CourseEntry
