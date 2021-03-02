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
import CompletionListItem from "/components/CompletionListItem"
import { formatDateTime } from "/components/DataFormatFunctions"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "/contexes/CollapseContext"
import {
  CourseStatistics_user_course_statistics_completion,
  CourseStatistics_user_course_statistics_course,
} from "/static/types/generated/CourseStatistics"

interface CompletionProps {
  completion?: CourseStatistics_user_course_statistics_completion
  course: CourseStatistics_user_course_statistics_course
}

export default function Completion({ completion, course }: CompletionProps) {
  const { state, dispatch } = useCollapseContext()

  if (!completion) {
    return null
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              Completed {formatDateTime(completion?.completion_date)}
            </TableCell>
            <TableCell>
              Registered{" "}
              {completion?.completions_registered
                ?.map((cr) => formatDateTime(cr.created_at))
                ?.join(", ")}
            </TableCell>
            <TableCell align="right">
              <CollapseButton
                open={state[course?.id ?? "_"]?.completion ?? false}
                onClick={() =>
                  dispatch({
                    type: ActionType.TOGGLE,
                    collapsable: CollapsablePart.COMPLETION,
                    course: course?.id ?? "_",
                  })
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>
              <Collapse in={state[course?.id ?? "_"]?.completion ?? false}>
                <CompletionListItem course={course} completion={completion} />
              </Collapse>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
  /*return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{completion ? "Completed" : "Not completed"}</TableCell>
            <TableCell align="right">
              {completion ?
                <CollapseButton
                  open={
                    state[course?.id ?? "_"]?.completion ?? false
                  }
                  onClick={() =>
                    dispatch({
                      type: ActionType.TOGGLE,
                      collapsable: CollapsablePart.COMPLETION,
                      course: course?.id ?? "_"
                    })
                  }
                /> : null}
            </TableCell>
          </TableRow>
        </TableHead>
        {completion ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
                <Collapse
                  in={
                    state[course?.id ?? "_"]?.completion ?? false
                  }
                >
                  <CompletionListItem
                    course={course}
                    completion={completion}
                  />

                </Collapse>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : null}
      </Table>
    </TableContainer>
  )*/
}
