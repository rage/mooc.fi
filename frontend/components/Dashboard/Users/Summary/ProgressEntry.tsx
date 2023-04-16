import React, { useCallback, useMemo } from "react"

import { Collapse, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import {
  UserCourseProgressCoreFieldsFragment,
  UserCourseServiceProgressCoreFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
} from "/graphql/generated"

interface ProgressEntryProps {
  course: UserCourseSummaryCourseFieldsFragment
  userCourseProgress: UserCourseProgressCoreFieldsFragment | null
  userCourseServiceProgresses: Array<UserCourseServiceProgressCoreFieldsFragment>
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

function ProgressEntry({
  course,
  userCourseProgress,
  userCourseServiceProgresses,
}: ProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  // TODO: extract hook
  const totalProgress = useMemo(() => {
    const { exercise_progress, extra } = userCourseProgress ?? {}

    if (extra) {
      return {
        percentage: (extra.pointsPercentage ?? 0) * 100,
        amount: extra.n_points ?? 0,
        total: extra.max_points ?? 0,
        ...(extra.pointsNeeded
          ? {
              required: extra.pointsNeeded,
              requiredPercentage:
                (extra.pointsNeeded / (extra.max_points || 1)) * 100,
              success: (extra.n_points ?? 0) >= extra.pointsNeeded,
            }
          : {}),
      }
    }
    return {
      percentage: (exercise_progress?.total ?? 0) * 100,
      amount: userCourseProgress?.n_points ?? 0,
      total: userCourseProgress?.max_points ?? 0,
      ...(course?.points_needed
        ? {
            required: course.points_needed,
            requiredPercentage:
              (course.points_needed / (userCourseProgress?.max_points || 1)) *
              100,
            success:
              (userCourseProgress?.n_points ?? 0) >= course.points_needed,
          }
        : {}),
    }
  }, [userCourseProgress])
  const exerciseProgress = useMemo(() => {
    const { exercise_progress, extra } = userCourseProgress ?? {}

    if (extra) {
      return {
        percentage: (extra.exercisePercentage ?? 0) * 100,
        amount: extra.totalExerciseCompletions ?? 0,
        total: extra.totalExerciseCount ?? 0,
        ...(extra.totalExerciseCompletionsNeeded
          ? {
              required: extra.totalExerciseCompletionsNeeded,
              requiredPercentage:
                (extra.totalExerciseCompletionsNeeded /
                  (extra.totalExerciseCount || 1)) *
                100,
              success:
                (extra.totalExerciseCompletions ?? 0) >=
                extra.totalExerciseCompletionsNeeded,
            }
          : {}),
      }
    }
    return {
      percentage: (exercise_progress?.exercises ?? 0) * 100,
      amount: exercise_progress?.exercises_completed_count ?? 0,
      total: exercise_progress?.exercise_count ?? 0,
      ...(course?.exercise_completions_needed
        ? {
            required: course.exercise_completions_needed,
            requiredPercentage:
              (course.exercise_completions_needed /
                (exercise_progress?.exercise_count || 1)) *
              100,
            success:
              (exercise_progress?.exercises_completed_count ?? 0) >=
              course.exercise_completions_needed,
          }
        : {}),
    }
  }, [userCourseProgress])

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
          userCourseProgress={userCourseProgress}
          userCourseServiceProgresses={userCourseServiceProgresses}
          showProgress={false}
        />
      </Collapse>
    </ProgressEntryCard>
  )
}

export default ProgressEntry
