import { DetailedHTMLProps, PropsWithChildren, useMemo } from "react"

import { MaterialReactTableProps, MRT_ColumnDef } from "material-react-table"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import { Chip, Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

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

interface NarrowCellProps {
  header: string
}

const NarrowCell = ({
  header,
  children,
  ...props
}: PropsWithChildren<
  NarrowCellProps &
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

const RequiredActionsContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
`

export const renderRequiredActionsBase =
  (t: Translator<any>) =>
  (
    values: ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"],
  ) =>
    (
      <RequiredActionsContainer>
        {values.map((action) => (
          <Chip key={action.id} label={t(action.value)} size="small" />
        ))}
      </RequiredActionsContainer>
    )

export const renderRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
  ): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) =>
    renderRequiredActionsBase(t)(
      cell.getValue<
        ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"]
      >(),
    )

export const renderNarrowRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) =>
    (
      <NarrowCell header={props.column.columnDef.header}>
        {renderRequiredActions<T>(t)(props)}
      </NarrowCell>
    )

export const renderCheckBase = (
  value: boolean,
  title: string,
  failureTitle?: string,
) => {
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

export const renderCheck =
  <T extends Record<string, any>>(
    title: string,
    failureTitle?: string,
  ): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) => {
    const value = cell.getValue<boolean>()

    return renderCheckBase(value, title, failureTitle)
  }

export const renderNarrowCheck =
  <T extends Record<string, any>>(
    title: string,
    failureTitle: string,
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) =>
    (
      <NarrowCell header={props.column.columnDef.header}>
        {renderCheck<T>(title, failureTitle)(props)}
      </NarrowCell>
    )

// eslint-disable-next-line @typescript-eslint/ban-types
export const renderNarrowCell: <T extends Record<string, any> = {}>(
  props: Parameters<NonNullable<MRT_ColumnDef<T>["Cell"]>>[0],
) => ReturnType<NonNullable<MRT_ColumnDef<T>["Cell"]>> = ({ cell, column }) => (
  <NarrowCell header={column.columnDef.header}>
    <Typography variant="body2" textAlign="right">
      {cell.getValue<any>()}
    </Typography>
  </NarrowCell>
)

export const useExerciseListProps = <T extends Record<string, any>>() => {
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const props = useMemo(
    (): Omit<MaterialReactTableProps<T>, "columns" | "data"> => ({
      layoutMode: "grid",
      enableColumnActions: false,
      displayColumnDefOptions: !isNarrow
        ? { "mrt-row-expand": { size: 15 } }
        : {},
      muiTablePaginationProps: {
        rowsPerPageOptions: [10, 30, 50, 100],
        sx: {
          ".MuiTablePagination-toolbar": {
            padding: "0.5rem",
            justifyContent: "center !important",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          },
          ".MuiTablePagination-selectRoot": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          },
          ".MuiTablePagination-spacer": {
            flex: "0 !important",
          },
        },
      },
      muiBottomToolbarProps: {
        sx: {
          padding: "0.5rem",
          justifyContent: "center !important",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          "& div": {
            justifyContent: "center",
          },
        },
      },
      muiTablePaperProps: {
        elevation: 0,
      },
      muiTableProps: {
        sx: {
          tableLayout: "fixed",
        },
      },
      muiTableDetailPanelProps: {
        sx: {
          display: isNarrow ? "none" : "table-cell",
          width: "100%",
        },
      },
      muiTableContainerProps: {
        sx: {
          width: "100%",
        },
      },
      muiTableBodyProps: {
        sx: {
          ...(isNarrow && {
            "& .Mui-TableBodyCell-DetailPanel": {
              display: "none",
            },
          }),
        },
      },
      muiTableHeadProps: {
        sx: {
          ...(isNarrow && { display: "none" }),
        },
      },
      muiTableHeadCellProps: {
        sx: {
          overflow: "unset",
          "& .Mui-TableHeadCell-Content-Wrapper": {
            overflow: "unset",
            textOverflow: "unset",
          },
        },
      },
      muiTableBodyRowProps: {
        sx: {
          ...(isNarrow && {
            margin: "0.5rem",
            width: "unset",
            flexDirection: "column",
            border: "1px solid rgba(224, 224, 244, 1)",
            borderRadius: "4px",
            padding: "0.5rem",
          }),
        },
      },
      muiTableBodyCellProps: {
        sx: {
          ...(isNarrow && {
            borderBottom: "1px solid rgba(224, 224, 244, 1)",
            width: "100%",
          }),
        },
      },
    }),
    [isNarrow],
  )

  return props
}
