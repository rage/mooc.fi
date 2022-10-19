import React from "react"

import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableRow,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

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

const CompletionTableContainer = styled((props: TableContainerProps) => (
  <TableContainer component={Paper} elevation={4} {...props} />
))`
  margin-bottom: 1rem;
`

const CompletionListItemContainer = styled("div")`
  padding: 0.5rem;
  width: 100%;
`

const CollapseTableRow = styled(TableRow)`
  & > * {
    border-bottom: unset;
  }
`

const CollapseTableCell = styled(TableCell)`
  padding-top: 0;
  padding-bottom: 0;
`

export default function Completion({ completion, course }: CompletionProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  if (!completion) {
    return null
  }

  const isOpen = state[course?.id ?? "_"]?.completion ?? false

  return (
    <CompletionTableContainer>
      <Table>
        <TableBody>
          <CollapseTableRow>
            <TableCell>
              <Typography variant="h3">
                {t("completedDate")}
                <strong>{formatDateTime(completion?.completion_date)}</strong>
              </Typography>
            </TableCell>
            <TableCell align="right">
              {completion?.completions_registered?.length > 0 && (
                <Typography variant="h3">
                  {t("registeredDate")}
                  <strong>
                    {completion?.completions_registered
                      ?.map((cr) => formatDateTime(cr.created_at))
                      ?.join(", ")}
                  </strong>
                </Typography>
              )}
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
                tooltip={t("completionCollapseTooltip")}
              />
            </TableCell>
          </CollapseTableRow>
          <CollapseTableRow>
            <CollapseTableCell colSpan={3}>
              <Collapse in={isOpen} mountOnEnter unmountOnExit>
                <CompletionListItemContainer>
                  <CompletionListItem course={course} completion={completion} />
                </CompletionListItemContainer>
              </Collapse>
            </CollapseTableCell>
          </CollapseTableRow>
        </TableBody>
      </Table>
    </CompletionTableContainer>
  )
}
