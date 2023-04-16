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
import { styled } from "@mui/material/styles"

import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "./CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import { CompletionListItem } from "/components/Home/Completions"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

import {
  CompletionDetailedFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
} from "/graphql/generated"

interface CompletionProps {
  completion?: CompletionDetailedFieldsFragment | null
  course: UserCourseSummaryCourseFieldsFragment
}

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

function Completion({ completion, course }: CompletionProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContext()

  const isOpen = useMemo(
    () => state.courses[course?.id ?? "_"]?.completion ?? false,
    [state, course],
  )

  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: ActionType.TOGGLE,
        collapsable: CollapsablePart.COMPLETION,
        course: course?.id ?? "_",
      }),
    [course],
  )

  if (!completion) {
    return null
  }

  return (
    <SummaryCard>
      <TableContainer>
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
                  onClick={onCollapseClick}
                  tooltip={t("completionCollapseTooltip")}
                />
              </TableCell>
            </CollapseTableRow>
            <CollapseTableRow>
              <CollapseTableCell colSpan={3}>
                <Collapse in={isOpen} mountOnEnter unmountOnExit>
                  <CompletionListItemContainer>
                    <CompletionListItem
                      course={course}
                      completion={completion}
                    />
                  </CompletionListItemContainer>
                </Collapse>
              </CollapseTableCell>
            </CollapseTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SummaryCard>
  )
}

export default Completion
