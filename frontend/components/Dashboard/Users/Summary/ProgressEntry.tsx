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

function ProgressEntry({
  course,
  userCourseProgress,
  userCourseServiceProgresses,
}: ProgressEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const { exercise_progress } = userCourseProgress ?? {}

  const isOpen = useMemo(
    () => state[course.id]?.points ?? false,
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
                  amount={userCourseProgress?.n_points ?? 0}
                  total={userCourseProgress?.max_points ?? 0}
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
                    userCourseProgress={userCourseProgress}
                    userCourseServiceProgresses={userCourseServiceProgresses}
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
