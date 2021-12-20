import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material"
import React from "react"
import CollapseButton from "/components/Buttons/CollapseButton"
import { CompletionListItem } from "/components/Home/Completions"
import { formatDateTime } from "/components/DataFormatFunctions"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import {
  UserSummary_user_user_course_summary_completion,
  UserSummary_user_user_course_summary_course,
} from "/static/types/generated/UserSummary"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

interface CompletionProps {
  completion?: UserSummary_user_user_course_summary_completion
  course: UserSummary_user_user_course_summary_course
}

export default function Completion({ completion, course }: CompletionProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  if (!completion) {
    return null
  }

  const isOpen = state[course?.id ?? "_"]?.completion ?? false

  return (
    <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              {t("completedDate")}
              {formatDateTime(completion?.completion_date)}
            </TableCell>
            <TableCell align="right">
              {t("registeredDate")}
              {completion?.completions_registered
                ?.map((cr) => formatDateTime(cr.created_at))
                ?.join(", ")}
            </TableCell>
            <TableCell align="right">
              <CollapseButton
                open={isOpen}
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
        </TableBody>
      </Table>
      <Collapse in={isOpen} unmountOnExit>
        <CompletionListItem course={course} completion={completion} />
      </Collapse>
    </TableContainer>
  )
}
