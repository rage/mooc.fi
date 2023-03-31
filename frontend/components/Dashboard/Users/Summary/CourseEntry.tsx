import React, { Dispatch, useCallback, useMemo, useState } from "react"

import { sortBy } from "lodash"

import {
  Card,
  CardContent,
  CardProps,
  Collapse,
  Paper,
  Skeleton,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import InfoRow from "../InfoRow"
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
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseEntryProps {
  data: UserCourseSummaryCoreFieldsFragment
  state: CourseState
  dispatch: Dispatch<CollapseAction>
}

const CourseEntryCard = styled(({ elevation = 4, ...props }: CardProps) => (
  <Card elevation={elevation} {...props} />
))`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

const CourseEntryCardTitleWrapper = styled("div")`
  display: flex;
  flex-direction: row;
`
const CourseEntryCardTitle = styled(CardTitle)``
const CourseEntryCardTitleRow = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`

const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
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
  const { admin } = useLoginStateContext()
  const [courseInfoOpen, setCourseInfoOpen] = useState(false)

  // TODO: subheaders for parts?
  const exercisesWithCompletions = useMemo(
    () =>
      sortBy(
        (data?.course?.exercises ?? []).map((exercise) => ({
          ...exercise,
          exercise_completions: (data?.exercise_completions ?? []).filter(
            (ec) => ec?.exercise_id === exercise.id,
          ),
        })),
        ["part", "section", "name"],
      ),
    [data?.course, data?.exercise_completions],
  )

  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.COURSE,
        course: data?.course?.id ?? "_",
      }),
    [data?.course?.id, dispatch],
  )

  const onCollapseCourseInfoClick = useCallback(
    () => setCourseInfoOpen((value) => !value),
    [],
  )

  if (!data.course) {
    return null
  }

  return (
    <CourseEntryCard>
      <CourseEntryCardTitleRow>
        <CourseEntryCardTitleWrapper>
          <CourseEntryCardTitle variant="h3">
            {data?.course?.name}
          </CourseEntryCardTitle>
          {admin && (
            <CollapseButton
              open={courseInfoOpen}
              onClick={onCollapseCourseInfoClick}
              tooltip={"show more info"}
            />
          )}
        </CourseEntryCardTitleWrapper>
        <CollapseButton
          open={state?.open}
          onClick={onCollapseClick}
          tooltip={t("courseCollapseTooltip")}
        />
      </CourseEntryCardTitleRow>
      {admin && (
        <Collapse in={courseInfoOpen} unmountOnExit>
          <CourseInfo>
            <InfoRow title="ID" content={data.course?.id} />
            <InfoRow title="Slug" content={data.course?.slug} />
          </CourseInfo>
        </Collapse>
      )}
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
