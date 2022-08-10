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
import { formatDateTime } from "/components/DataFormatFunctions"
import { CompletionListItem } from "/components/Home/Completions"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import {
  CompletionDetailedFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
} from "/graphql/generated"

interface CompletionProps {
  completion?: CompletionDetailedFieldsFragment
  course: UserCourseSummaryCourseFieldsFragment
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
