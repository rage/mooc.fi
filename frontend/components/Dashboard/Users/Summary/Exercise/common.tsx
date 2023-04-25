import { DetailedHTMLProps, PropsWithChildren, useMemo } from "react"

import { merge } from "lodash"
import { MaterialReactTableProps, MRT_ColumnDef } from "material-react-table"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import XMarkIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg?icon"
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import {
  Chip,
  ChipProps,
  TableCellProps,
  Theme,
  Tooltip,
  Typography,
  TypographyProps,
  useMediaQuery,
} from "@mui/material"
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

interface NarrowCellBaseProps {
  header: string
  tooltip?: string
  headerProps?: TypographyProps
}

export const NarrowCellBase = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 1rem;
`

type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never

const TooltipWrapper = styled("div")`
  margin-left: auto;
  padding: 0 0.5rem;
`

const NarrowCell = ({
  header,
  tooltip,
  headerProps,
  children,
  ...props
}: PropsWithChildren<NarrowCellBaseProps & PropsOf<typeof NarrowCellBase>>) => (
  <NarrowCellBase {...props}>
    <Typography variant="body2" fontWeight="bold" width="50%" {...headerProps}>
      {header}
      {tooltip && (
        <TooltipWrapper>
          <Tooltip title={tooltip}>
            <HelpIcon />
          </Tooltip>
        </TooltipWrapper>
      )}
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

type RequiredActionBaseProps = {
  containerProps?: PropsOf<typeof RequiredActionsContainer>
  chipProps?: ChipProps
}

export const renderRequiredActionsBase =
  (
    t: Translator<any>,
    { containerProps, chipProps }: RequiredActionBaseProps = {},
  ) =>
  (
    values: ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"],
  ) =>
    (
      <RequiredActionsContainer {...containerProps}>
        {values.map((action) => (
          <Chip
            key={action.id}
            label={t(action.value)}
            size="small"
            {...chipProps}
          />
        ))}
      </RequiredActionsContainer>
    )

export const renderRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
    props?: RequiredActionBaseProps,
  ): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) =>
    renderRequiredActionsBase(
      t,
      props,
    )(
      cell.getValue<
        ExerciseCompletionCoreFieldsFragment["exercise_completion_required_actions"]
      >(),
    )

type NarrowRequiredActionProps = RequiredActionBaseProps & {
  cellProps?: Partial<NarrowCellBaseProps> & PropsOf<typeof NarrowCellBase>
}

export const renderNarrowRequiredActions =
  <T extends Record<string, any>>(
    t: Translator<any>,
    actionProps: NarrowRequiredActionProps = {},
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) => {
    const { cellProps, ...requiredActionProps } = actionProps
    return (
      <NarrowCell {...cellProps} header={props.column.columnDef.header}>
        {renderRequiredActions<T>(t, requiredActionProps)(props)}
      </NarrowCell>
    )
  }

export const renderCheckBase =
  (success: string, failure?: string) => (value: boolean) => {
    if (!value) {
      if (!failure) {
        return
      }
      return <XMarkIcon css={iconStyle} color="warning" titleAccess={failure} />
    }

    return <CheckIcon css={iconStyle} color="success" titleAccess={success} />
  }

type CheckProps = {
  success: string
  failure?: string
}

export const renderCheck =
  <T extends Record<string, any>>({
    success,
    failure,
  }: CheckProps): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  ({ cell }) => {
    const value = cell.getValue<boolean>()

    return renderCheckBase(success, failure)(value)
  }

export const renderNarrowCheck =
  <T extends Record<string, any>>(
    checkProps: CheckProps &
      Partial<NarrowCellBaseProps> &
      PropsOf<typeof NarrowCellBase>,
  ): MRT_ColumnDef<T>["Cell"] =>
  (props) => {
    const { success, failure, ...cellProps } = checkProps
    return (
      <NarrowCell {...cellProps} header={props.column.columnDef.header}>
        {renderCheck<T>({ success, failure })(props)}
      </NarrowCell>
    )
  }

type NarrowCellProps<T extends Record<string, any>> =
  Partial<NarrowCellBaseProps> & {
    cellProps?:
      | ((
          props: Parameters<NonNullable<MRT_ColumnDef<T>["Cell"]>>[0],
        ) => PropsOf<typeof NarrowCellBase>)
      | PropsOf<typeof NarrowCellBase>
    headerProps?:
      | ((
          props: Parameters<NonNullable<MRT_ColumnDef<T>["Cell"]>>[0],
        ) => TypographyProps)
      | TypographyProps
    valueProps?:
      | ((
          props: Parameters<NonNullable<MRT_ColumnDef<T>["Cell"]>>[0],
        ) => TypographyProps)
      | TypographyProps
  }

export const renderNarrowCell =
  <T extends Record<string, any>>({
    tooltip,
    cellProps,
    headerProps,
    valueProps,
  }: NarrowCellProps<T> = {}): NonNullable<MRT_ColumnDef<T>["Cell"]> =>
  (props) => {
    let _cellProps = cellProps
    if (typeof cellProps === "function") {
      _cellProps = cellProps(props)
    }
    let _valueProps = valueProps
    if (typeof valueProps === "function") {
      _valueProps = valueProps(props)
    }
    let _headerProps = headerProps
    if (typeof headerProps === "function") {
      _headerProps = headerProps(props)
    }
    return (
      <NarrowCell
        header={props.column.columnDef.header}
        tooltip={tooltip}
        headerProps={_headerProps}
        {..._cellProps}
      >
        <Typography variant="body2" textAlign="right" {..._valueProps}>
          {props.cell.getValue<any>()}
        </Typography>
      </NarrowCell>
    )
  }

export const useExerciseListProps = <T extends Record<string, any>>() => {
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))
  const isVeryNarrow = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  )

  const isWide = !isNarrow && !isVeryNarrow

  const props = useMemo(
    (): Omit<MaterialReactTableProps<T>, "columns" | "data"> => ({
      layoutMode: "grid",
      enableTableHead: isWide,
      enableColumnActions: false,
      enableSorting: false,
      displayColumnDefOptions: isWide ? { "mrt-row-expand": { size: 15 } } : {},
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
        sx: {
          width: "100%",
        },
      },
      muiTableProps: {
        sx: {
          tableLayout: "fixed",
        },
      },
      muiTableDetailPanelProps: {
        sx: {
          display: !isWide ? "none" : "table-cell",
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
          ...(!isWide && {
            "& .Mui-TableBodyCell-DetailPanel": {
              display: "none",
            },
          }),
        },
      },
      muiTableHeadCellProps: {
        sx: {
          textAlign: "left",
          overflow: "unset",
          "& .Mui-TableHeadCell-Content-Labels": {
            overflow: "inherit",
          },
          "& .Mui-TableHeadCell-Content-Wrapper": {
            overflow: "unset",
            textOverflow: "unset",
          },
          "& .Mui-TableHeadCell-Content-Actions": {
            display: "none",
          },
        },
      },
      muiTableBodyRowProps: {
        sx: {
          ...(!isWide && {
            margin: "0.5rem",
            width: "unset",
            flexDirection: "column",
            border: "1px solid rgba(224, 224, 244, 1)",
            borderRadius: "4px",
            padding: "0.5rem",
          }),
          ...(isVeryNarrow && {
            padding: "0",
            border: "none",
            marginBottom: "1rem",
          }),
        },
      },
      muiTableBodyCellProps: {
        sx: {
          ...(!isWide && {
            borderBottom: "1px solid rgba(224, 224, 244, 1)",
            width: "100%",
            ":first-of-type": {
              display: "none",
            },
          }),
        },
      },
    }),
    [isNarrow, isVeryNarrow, isWide],
  )

  return props
}

type MuiCellProps<T extends Record<string, any>> = {
  [K in keyof NonNullable<MRT_ColumnDef<T>> & `mui${string}Props`]: NonNullable<
    MRT_ColumnDef<T>[K]
  >
}
type MuiPropsType<T extends Record<string, any>> = {
  [K in keyof MuiCellProps<T>]: ReturnType<Extract<MuiCellProps<T>[K], AnyFn>>
}
type MuiCellPropsParams<
  T extends Record<string, any>,
  K extends keyof MuiCellProps<T>,
> = Parameters<Extract<MuiCellProps<T>[K], AnyFn>>

type AnyFn = (...args: any[]) => any

export const mergeOriginalMuiProps =
  <
    T extends Record<string, any> = Record<string, any>,
    K extends keyof MuiPropsType<T> = keyof MuiPropsType<T>,
  >(
    props: MuiCellPropsParams<T, K>[0],
  ) =>
  (
    originalProps?: MuiCellProps<T>[K],
    newProps?: MuiPropsType<T>[K],
  ): MuiPropsType<T>[K] => {
    let originalMuiProps: any

    if (typeof originalProps === "function") {
      originalMuiProps = originalProps(props as any)
    } else {
      originalMuiProps = originalProps ?? {}
    }

    return merge(originalMuiProps, newProps ?? {}) as MuiPropsType<T>[K]
  }

export const mergeOriginalCellProps = <T extends Record<string, any>>(
  props: Parameters<
    Exclude<
      NonNullable<MRT_ColumnDef<T>["muiTableBodyCellProps"]>,
      TableCellProps
    >
  >[0],
  newProps: TableCellProps,
): ReturnType<
  Exclude<
    NonNullable<MRT_ColumnDef<T>["muiTableBodyCellProps"]>,
    TableCellProps
  >
> => {
  const { table } = props
  let originalProps: TableCellProps = {}

  const originalMuiTableBodyCellProps = table.options.muiTableBodyCellProps
  if (typeof originalMuiTableBodyCellProps === "function") {
    originalProps = originalMuiTableBodyCellProps(props)
  } else {
    originalProps = originalMuiTableBodyCellProps ?? {}
  }

  return merge(originalProps, newProps)
}
