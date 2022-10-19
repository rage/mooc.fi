import React, { Dispatch, useMemo } from "react"

import { sortBy } from "lodash"

import { Card, CardContent, Collapse, Paper, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ActionType,
  CollapsablePart,
  CollapseAction,
  CourseState,
} from "./CollapseContext"
import Completion from "./Completion"
import ExerciseList from "./ExerciseList"
import ProgressEntry from "./ProgressEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import RelevantDates from "/components/Dashboard/Users/Summary/RelevantDates"
import { CardTitle } from "/components/Text/headers"
import ProfileTranslations from "/translations/profile"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseEntryProps {
  data: UserCourseSummaryCoreFieldsFragment
  state: CourseState
  dispatch: Dispatch<CollapseAction>
}

const CourseEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

CourseEntryCard.defaultProps = {
  elevation: 4,
}

const CourseEntryCardTitle = styled(CardTitle)`
  display: flex;
  justify-content: space-between;
`

const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

export const SkeletonCourseEntry = () => (
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

function CourseEntry({ data, state, dispatch }: CourseEntryProps) {
  const t = useTranslator(ProfileTranslations)

  // TODO: subheaders for parts?
  const exercisesWithCompletions = useMemo(
    () =>
      sortBy(
        data?.course?.exercises?.filter(notEmpty).map((exercise) => ({
          ...exercise,
          exercise_completions:
            data?.exercise_completions
              ?.filter((ec) => ec?.exercise_id === exercise.id)
              .filter(notEmpty) ?? [],
        })) ?? [],
        ["part", "section", "name"],
      ),
    [data?.course],
  )

  if (!data.course) {
    return null
  }

  return (
    <CourseEntryCard>
      <CourseEntryCardTitle variant="h3">
        {data?.course?.name}
        <CollapseButton
          open={state?.open}
          onClick={() =>
            dispatch({
              type: ActionType.TOGGLE,
              collapsable: CollapsablePart.COURSE,
              course: data?.course?.id ?? "_",
            })
          }
          tooltip={t("courseCollapseTooltip")}
        />
      </CourseEntryCardTitle>
      <Collapse in={state?.open} unmountOnExit>
        <CardContent>
          <RelevantDates data={data} />
          <Completion
            course={data.course}
            completion={data.completion ?? undefined}
          />
          <ProgressEntry data={data} />
          <ExerciseList exercises={exercisesWithCompletions} />
        </CardContent>
      </Collapse>
    </CourseEntryCard>
  )
}

export default CourseEntry
