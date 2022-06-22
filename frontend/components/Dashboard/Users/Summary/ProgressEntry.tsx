import React from "react"

import CollapseButton from "/components/Buttons/CollapseButton"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { UserCourseProgressFragment } from "/static/types/generated/UserCourseProgressFragment"
import { UserCourseServiceProgressFragment } from "/static/types/generated/UserCourseServiceProgressFragment"
import {
  UserSummary_user_user_course_summary_course,
  UserSummary_user_user_course_summary_exercise_completions,
} from "/static/types/generated/UserSummary"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"

interface ProgressEntryProps {
  userCourseProgress?: UserCourseProgressFragment | null
  userCourseServiceProgresses?: UserCourseServiceProgressFragment[] | null
  exerciseCompletions?:
    | UserSummary_user_user_course_summary_exercise_completions[]
    | null
  course: UserSummary_user_user_course_summary_course
}

export default function ProgressEntry({
  userCourseProgress,
  userCourseServiceProgresses,
  exerciseCompletions,
  course,
}: ProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const isOpen = state[course?.id ?? "_"]?.points ?? false

  return (
    <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{t("progress")}</TableCell>
            <TableCell>
              <PointsProgress
                amount={userCourseProgress?.n_points ?? 0}
                required={course?.points_needed}
                percentage={
                  (userCourseProgress?.exercise_progress?.total ?? 0) * 100
                }
                title={t("totalProgress")}
              />
            </TableCell>
            <TableCell>
              <PointsProgress
                amount={exerciseCompletions?.length}
                required={course?.exercise_completions_needed}
                percentage={
                  (userCourseProgress?.exercise_progress?.exercises ?? 0) * 100
                }
                title={t("exercisesCompleted")}
              />
            </TableCell>
            <TableCell align="right">
              <CollapseButton
                open={isOpen}
                onClick={() =>
                  dispatch({
                    type: ActionType.TOGGLE,
                    collapsable: CollapsablePart.POINTS,
                    course: course?.id ?? "_",
                  })
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Collapse in={isOpen} unmountOnExit>
        <PointsListItemCard
          course={course}
          userCourseProgress={userCourseProgress}
          userCourseServiceProgresses={userCourseServiceProgresses}
          showProgress={false}
        />
      </Collapse>
    </TableContainer>
  )
}
