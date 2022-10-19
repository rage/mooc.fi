import React from "react"

import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
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
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface ProgressEntryProps {
  data: UserCourseSummaryCoreFieldsFragment
}

export default function ProgressEntry({ data }: ProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const { course, user_course_progress, user_course_service_progresses } = data
  const { exercise_progress } = user_course_progress ?? {}

  const isOpen = state[course?.id ?? "_"]?.points ?? false

  return (
    <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="h3">{t("progress")}</Typography>
            </TableCell>
            <TableCell>
              <PointsProgress
                percentage={(exercise_progress?.total ?? 0) * 100}
                title={t("totalProgress")}
                pointsTitle={t("points")}
                amount={user_course_progress?.n_points ?? 0}
                total={user_course_progress?.max_points ?? 0}
              />
            </TableCell>
            <TableCell>
              <PointsProgress
                percentage={(exercise_progress?.exercises ?? 0) * 100}
                title={t("exercisesCompleted")}
                amount={exercise_progress?.exercises_completed_count ?? 0}
                total={exercise_progress?.exercise_count ?? 0}
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
                tooltip={t("progressCollapseTooltip")}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Collapse in={isOpen} unmountOnExit>
        <PointsListItemCard
          course={course}
          userCourseProgress={user_course_progress}
          userCourseServiceProgresses={(
            user_course_service_progresses ?? []
          ).filter(notEmpty)}
          showProgress={false}
        />
      </Collapse>
    </TableContainer>
  )
}
