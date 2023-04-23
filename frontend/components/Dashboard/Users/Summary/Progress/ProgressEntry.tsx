import React, { useCallback, useMemo } from "react"

import { Collapse, Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useCollapseContext } from "../contexts"
import { ActionType, CollapsablePart } from "../contexts/CollapseContext"
import useProgress from "../hooks/useProgress"
import CollapseButton from "/components/Buttons/CollapseButton"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import PointsProgress, {
  PointsProgressSkeleton,
} from "/components/Dashboard/PointsProgress"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

interface ProgressEntryProps {
  data:
    | UserCourseSummaryCoreFieldsFragment
    | UserTierCourseSummaryCoreFieldsFragment
}

const ProgressEntryCard = styled(SummaryCard)`
  padding: 1rem;
`

const ProgressContainer = styled("div")`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const TitleContainer = styled("div")`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

function ProgressEntry({ data }: ProgressEntryProps) {
  const { course, user_course_progress, user_course_service_progresses } = data
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const { totalProgress, exerciseProgress } = useProgress(data)
  const isOpen = useMemo(
    () => state.courses[course.id]?.points ?? false,
    [state, course],
  )
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.POINTS,
        course: course.id ?? "_",
      }),
    [dispatch, course],
  )

  return (
    <ProgressEntryCard>
      <TitleContainer>
        <Typography variant="h3">{t("progress")}</Typography>
        <CollapseButton
          open={isOpen}
          onClick={onCollapseClick}
          tooltip={t("progressCollapseTooltip")}
        />
      </TitleContainer>
      <ProgressContainer>
        <PointsProgress
          {...totalProgress}
          title={t("totalProgress")}
          pointsTitle={t("points")}
          {...(totalProgress.required
            ? {
                requiredTitle: t("pointsRequired"),
              }
            : {})}
        />
        <PointsProgress
          {...exerciseProgress}
          title={t("exercisesCompleted")}
          {...(exerciseProgress.required
            ? {
                requiredTitle: t("pointsRequired"),
              }
            : {})}
        />
      </ProgressContainer>
      <Collapse in={isOpen} unmountOnExit>
        <PointsListItemCard
          course={course}
          userCourseProgress={user_course_progress}
          userCourseServiceProgresses={user_course_service_progresses}
          showProgress={false}
        />
      </Collapse>
    </ProgressEntryCard>
  )
}

export const ProgressEntrySkeleton = () => (
  <ProgressEntryCard>
    <TitleContainer>
      <Typography variant="h3">
        <Skeleton variant="text" width="200px" />
      </Typography>
    </TitleContainer>
    <ProgressContainer>
      <PointsProgressSkeleton />
      <PointsProgressSkeleton />
    </ProgressContainer>
  </ProgressEntryCard>
)

export default ProgressEntry
