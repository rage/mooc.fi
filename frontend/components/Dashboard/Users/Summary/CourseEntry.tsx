import React from "react"

import { sortBy } from "lodash"

import styled from "@emotion/styled"
import { Card, CardContent, Collapse, Paper, Skeleton } from "@mui/material"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import Completion from "./Completion"
import ExerciseList from "./ExerciseList"
import ProgressEntry from "./ProgressEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import { CardTitle } from "/components/Text/headers"
import notEmpty from "/util/notEmpty"

import { UserCourseSummaryCoreFieldsFragment } from "/static/types/generated"

interface CourseEntryProps {
  data?: UserCourseSummaryCoreFieldsFragment
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
      <Skeleton />
    </CardTitle>
    <CardContent>
      <CourseEntryPartSkeleton />
      <CourseEntryPartSkeleton />
      <CourseEntryPartSkeleton />
    </CardContent>
  </CourseEntryCard>
)
function CourseEntry({ data }: CourseEntryProps) {
  const { state, dispatch } = useCollapseContext()

  if (!data) {
    return <CourseEntryCardSkeleton />
  }

  if (!data.course) {
    return null
  }

  const isOpen = state[data?.course?.id ?? "_"]?.open
  // TODO: subheaders for parts?
  const exercisesWithCompletions =
    data.course?.exercises?.filter(notEmpty).map((exercise) => ({
      ...exercise,
      exercise_completions:
        data.exercise_completions
          ?.filter((ec) => ec?.exercise_id === exercise.id)
          .filter(notEmpty) ?? [],
    })) ?? []

  return (
    <CourseEntryCard>
      <CardTitle
        variant="h3"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
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
            exercises={sortBy(exercisesWithCompletions, ["name"])}
          />
        </CardContent>
      </Collapse>
    </CourseEntryCard>
  )
}

export default CourseEntry
