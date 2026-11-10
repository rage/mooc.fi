import { PropsWithChildren, ReactNode } from "react"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import { Chip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { iconStyle } from "../common"
import { getColumnLabel, SummaryCellProps } from "../SummaryTable"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations, { Profile } from "/translations/profile"

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
  TierProgressExerciseCompletionFieldsFragment,
  TierProgressFieldsFragment,
} from "/graphql/generated"

export type ExerciseWithCompletions = ExerciseCoreFieldsFragment & {
  exercise_completions: ExerciseCompletionCoreFieldsFragment[]
}

export type ExerciseRow = {
  name: string
  part: number
  section: number
  partSection: string
  points: string
  max_points: number
  completed: boolean
  attempted: boolean
  exercise_completion_required_actions: ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"]
  created_at?: string
  timestamp?: string
  exercise_completions: ExerciseCompletionCoreFieldsFragment[]
}

export type TierExerciseCompletionRow =
  TierProgressExerciseCompletionFieldsFragment & {
    id: string
    tier: number | null
    points: string
    completed: boolean | null
    exercise_completion_required_actions: Array<{
      id: string
      value: string
    }>
  }

export type TierExerciseRow = TierProgressFieldsFragment & {
  id: string
  exercise_number: number
  name: string
  tier: number
  points: string
  exercise_completions: Array<TierExerciseCompletionRow>
  completed: boolean
}

const NarrowCellBase = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 1rem;
`

/** A labelled value for the stacked narrow-screen table layout, where there is no table head. */
export const NarrowCell = ({
  header,
  children,
}: PropsWithChildren<{ header: string }>) => (
  <NarrowCellBase>
    <Typography variant="body2" sx={{ fontWeight: "bold", width: "50%" }}>
      {header}
    </Typography>
    {children}
  </NarrowCellBase>
)

const RequiredActionsContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
`

type RequiredActionList =
  ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"]

const RequiredActions = ({ actions }: { actions: RequiredActionList }) => {
  const t = useTranslator(ProfileTranslations)

  return (
    <RequiredActionsContainer>
      {actions.map((action) => (
        <Chip
          key={action.id}
          label={t(action.value as keyof Profile)}
          size="small"
        />
      ))}
    </RequiredActionsContainer>
  )
}

interface CompletionCheckProps {
  isChecked: boolean | null
  success: string
  /** Shown as a cross when unchecked; without it nothing is shown. */
  failure?: string
}

const CompletionCheck = ({
  isChecked,
  success,
  failure,
}: CompletionCheckProps) => {
  if (isChecked) {
    return <CheckIcon css={iconStyle} color="success" titleAccess={success} />
  }
  if (failure) {
    return <XMarkIcon css={iconStyle} color="warning" titleAccess={failure} />
  }
  return null
}

export const renderCheck =
  (labels: Omit<CompletionCheckProps, "isChecked">) =>
  ({ getValue }: SummaryCellProps<boolean | null>) => (
    <CompletionCheck isChecked={getValue()} {...labels} />
  )

export const renderNarrowCheck =
  (labels: Omit<CompletionCheckProps, "isChecked">) =>
  (props: SummaryCellProps<boolean | null>) => (
    <NarrowCell header={getColumnLabel(props)}>
      <CompletionCheck isChecked={props.getValue()} {...labels} />
    </NarrowCell>
  )

export const renderRequiredActions = ({
  getValue,
}: SummaryCellProps<RequiredActionList>) => (
  <RequiredActions actions={getValue()} />
)

export const renderNarrowRequiredActions = (
  props: SummaryCellProps<RequiredActionList>,
) => (
  <NarrowCell header={getColumnLabel(props)}>
    <RequiredActions actions={props.getValue()} />
  </NarrowCell>
)

export const renderNarrowCell =
  (isEmphasized?: (value: ReactNode) => boolean) =>
  (props: SummaryCellProps<ReactNode>) => {
    const value = props.getValue()

    return (
      <NarrowCell header={getColumnLabel(props)}>
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            ...(isEmphasized?.(value) && { fontWeight: 800 }),
          }}
        >
          {value}
        </Typography>
      </NarrowCell>
    )
  }
