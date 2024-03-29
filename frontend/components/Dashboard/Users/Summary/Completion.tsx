import React, { PropsWithChildren, useCallback, useMemo } from "react"

import {
  Collapse,
  Skeleton,
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
  useCollapseContextCourse,
} from "./contexts/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
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
  & > td {
    border-bottom: unset;
    padding: 1rem 0 0 0;
  }
`

const CollapseTableCell = styled(TableCell)`
  padding-top: 0;
  padding-bottom: 0;
`

const CompletionListItemStyled = styled(CompletionListItem)`
  padding: 0;
`

function CompletionBase({ children }: PropsWithChildren) {
  return (
    <TableContainer>
      <Table>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  )
}

function Completion({ completion, course }: CompletionProps) {
  const t = useTranslator(ProfileTranslations)
  const { state, dispatch } = useCollapseContextCourse(course?.id)

  const isOpen = useMemo(() => state?.completion ?? false, [state])

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
    <CompletionBase>
      <CollapseTableRow>
        <TableCell>
          <Typography variant="h3">
            {t("completedDate")}{" "}
            <strong>{formatDateTime(completion?.completion_date)}</strong>
          </Typography>
        </TableCell>
        <TableCell align="right">
          {completion?.completions_registered?.length > 0 && (
            <Typography variant="h3">
              {t("registeredDate")}{" "}
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
              <CompletionListItemStyled
                course={course}
                completion={completion}
                elevation={0}
              />
            </CompletionListItemContainer>
          </Collapse>
        </CollapseTableCell>
      </CollapseTableRow>
    </CompletionBase>
  )
}

export const CompletionSkeleton = () => (
  <CompletionBase>
    <CollapseTableRow>
      <TableCell>
        <Typography variant="h3">
          <Skeleton variant="text" />
        </Typography>
      </TableCell>
      <TableCell align="right" />
      <TableCell align="right">
        <Skeleton width={24} />
      </TableCell>
    </CollapseTableRow>
  </CompletionBase>
)

export default Completion
