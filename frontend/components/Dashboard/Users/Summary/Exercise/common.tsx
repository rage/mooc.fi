import { DetailedHTMLProps, PropsWithChildren } from "react"

import { MRT_ColumnDef } from "material-react-table"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import { Chip, Typography } from "@mui/material"

import { iconStyle } from "../common"
import { Translator } from "/translations"

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

interface MobileCellProps {
  header: string
}

const MobileCell = ({
  header,
  children,
  ...props
}: PropsWithChildren<
  MobileCellProps &
    DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      paddingRight: "1rem",
    }}
    {...props}
  >
    <Typography variant="body2" fontWeight="bold" width="50%">
      {header}
    </Typography>
    {children}
  </div>
)

export const renderRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
  ): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) =>
    (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        {cell
          .getValue<
            ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"]
          >()
          .map((action) => (
            <Chip key={action.id} label={t(action.value)} size="small" />
          ))}
      </div>
    )

export const renderMobileRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) =>
    (
      <MobileCell header={props.column.columnDef.header}>
        {renderRequiredActions<T>(t)(props)}
      </MobileCell>
    )

export const renderCheck =
  <T extends Record<string, any>>(
    title: string,
    failureTitle?: string,
  ): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) => {
    const value = cell.getValue<boolean>()

    if (!value) {
      if (!failureTitle) {
        return
      }
      return (
        <XMarkIcon css={iconStyle} color="warning" titleAccess={failureTitle} />
      )
    }

    return <CheckIcon css={iconStyle} color="success" titleAccess={title} />
  }

export const renderMobileCheck =
  <T extends Record<string, any>>(
    title: string,
    failureTitle: string,
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) =>
    (
      <MobileCell header={props.column.columnDef.header}>
        {renderCheck<T>(title, failureTitle)(props)}
      </MobileCell>
    )

// eslint-disable-next-line @typescript-eslint/ban-types
export const renderMobileCell: <T extends Record<string, any> = {}>(
  props: Parameters<NonNullable<MRT_ColumnDef<T>["Cell"]>>[0],
) => ReturnType<NonNullable<MRT_ColumnDef<T>["Cell"]>> = ({ cell, column }) => (
  <MobileCell header={column.columnDef.header}>
    <Typography variant="body2">{cell.getValue<any>()}</Typography>
  </MobileCell>
)
