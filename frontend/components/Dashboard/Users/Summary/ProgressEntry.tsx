import React from "react"

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
import CollapseButton from "/components/Buttons/CollapseButton"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import PointsProgress from "/components/Dashboard/PointsProgress"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import {
  UserCourseProgressCoreFieldsFragment,
  UserCourseServiceProgressCoreFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
} from "/graphql/generated"

interface ProgressEntryProps {
  userCourseProgress?: UserCourseProgressCoreFieldsFragment | null
  userCourseServiceProgresses?:
    | UserCourseServiceProgressCoreFieldsFragment[]
    | null
  course: UserCourseSummaryCourseFieldsFragment
}

export default function ProgressEntry({
  userCourseProgress,
  userCourseServiceProgresses,
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
                total={
                  (userCourseProgress?.exercise_progress?.total ?? 0) * 100
                }
                title={t("totalProgress")}
              />
            </TableCell>
            <TableCell>
              <PointsProgress
                total={
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
