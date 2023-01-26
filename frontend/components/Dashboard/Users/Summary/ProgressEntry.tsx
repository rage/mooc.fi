import React, { useCallback, useMemo } from "react"

import {
  Collapse,
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
import {
  CollapseTableCell,
  CollapseTableRow,
  SummaryCard,
} from "/components/Dashboard/Users/Summary/common"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface ProgressEntryProps {
  data: UserCourseSummaryCoreFieldsFragment
}

function ProgressEntry({ data }: ProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const { course, user_course_progress, user_course_service_progresses } = data
  const { exercise_progress } = user_course_progress ?? {}

  const isOpen = useMemo(
    () => state[course?.id ?? "_"]?.points ?? false,
    [state, course],
  )
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.POINTS,
        course: course?.id ?? "_",
      }),
    [dispatch, course],
  )

  return (
    <SummaryCard>
      <TableContainer>
        <Table>
          <TableBody>
            <CollapseTableRow>
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
                  onClick={onCollapseClick}
                  tooltip={t("progressCollapseTooltip")}
                />
              </TableCell>
            </CollapseTableRow>
            <TableRow>
              <CollapseTableCell colSpan={4}>
                <Collapse in={isOpen} unmountOnExit>
                  <PointsListItemCard
                    course={course}
                    userCourseProgress={user_course_progress}
                    userCourseServiceProgresses={user_course_service_progresses}
                    showProgress={false}
                  />
                </Collapse>
              </CollapseTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SummaryCard>
  )
}

export default ProgressEntry
