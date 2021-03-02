import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core"
import React from "react"
import CollapseButton from "/components/Buttons/CollapseButton"
import PointsListItemCard from "/components/Dashboard/PointsListItemCard"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "/contexes/CollapseContext"
import { CourseStatistics_user_course_statistics_course } from "/static/types/generated/CourseStatistics"
import { UserCourseProgressFragment } from "/static/types/generated/UserCourseProgressFragment"
import { UserCourseServiceProgressFragment } from "/static/types/generated/UserCourseServiceProgressFragment"

interface ProgressEntryProps {
  userCourseProgress?: UserCourseProgressFragment
  userCourseServiceProgresses?: UserCourseServiceProgressFragment[]
  course: CourseStatistics_user_course_statistics_course
}

export default function ProgressEntry({
  userCourseProgress,
  userCourseServiceProgresses,
  course,
}: ProgressEntryProps) {
  const { state, dispatch } = useCollapseContext()

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Progress</TableCell>
            <TableCell align="right">
              <CollapseButton
                open={state[course?.id ?? "_"]?.points ?? false}
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
          <TableRow>
            <TableCell colSpan={2}>
              <Collapse in={state[course?.id ?? "_"]?.points ?? false}>
                <PointsListItemCard
                  course={course}
                  userCourseProgress={userCourseProgress}
                  userCourseServiceProgresses={userCourseServiceProgresses}
                />
              </Collapse>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
