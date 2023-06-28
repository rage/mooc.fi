import { useCallback, useMemo, useRef } from "react"

import type {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableInstance,
} from "material-react-table"
import { useRouter } from "next/router"

import {
  TableCellProps,
  TableRowProps,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ExerciseRow,
  renderCheck,
  renderHeader,
  renderNarrowCell,
  renderNarrowCheck,
  renderNarrowRequiredActions,
  renderRequiredActions,
  useExerciseListProps,
} from "./common"
import ExerciseInfo from "./ExerciseInfo"
import {
  MaterialReactTable,
  SummaryCard,
  useMaterialReactTableLocalization,
} from "/components/Dashboard/Users/Summary/common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

import { ExerciseWithExerciseCompletionsFieldsFragment } from "/graphql/generated"

const mapExerciseToRow =
  (locale?: string) =>
  (exercise: ExerciseWithExerciseCompletionsFieldsFragment): ExerciseRow => {
    const exerciseCompletion = exercise.exercise_completions?.[0]

    const created_at = exerciseCompletion?.created_at
      ? formatDateTime(exerciseCompletion.created_at, locale)
      : undefined
    const timestamp = exerciseCompletion?.timestamp
      ? formatDateTime(exerciseCompletion.timestamp, locale)
      : undefined

    return {
      part: exercise.part ?? 0,
      section: exercise.section ?? 0,
      partSection: `${exercise.part ?? 0}/${exercise.section ?? 0}`,
      name: exercise.name ?? "",
      points: `${Math.round((exerciseCompletion?.n_points ?? 0) * 100) / 100}/${
        exercise.max_points
      }`,
      max_points: exercise.max_points ?? 0,
      completed:
        exercise.exercise_completions?.some((e) => e.completed) ?? false,
      attempted:
        exercise.exercise_completions?.some((e) => e.attempted) ?? false,
      exercise_completion_required_actions:
        exerciseCompletion?.exercise_completion_required_actions ?? [],
      created_at,
      timestamp,
      exercise_completions: exercise.exercise_completions ?? [],
    }
  }

interface ExerciseListProps {
  data?: Array<ExerciseWithExerciseCompletionsFieldsFragment> | null
  loading?: boolean
}

const renderNarrowCellFn = renderNarrowCell<ExerciseRow>()

const hideCellIfNoExerciseCompletions = ({
  row,
}: {
  row: MRT_Row<ExerciseRow>
}): TableCellProps =>
  row.original.exercise_completions?.length > 0
    ? {}
    : { sx: { display: "none" } }

const ExerciseListTitle = () => {
  const t = useTranslator(ProfileTranslations)

  return <Typography variant="h3">{t("exercises")}</Typography>
}

const ExerciseListSummaryCard = styled(SummaryCard)`
  padding: 0.5rem;
`

function ExerciseList({ data, loading }: ExerciseListProps) {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()
  const tableInstanceRef = useRef<MRT_TableInstance<ExerciseRow>>(null)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo((): Array<MRT_ColumnDef<ExerciseRow>> => {
    if (!isNarrow) {
      return [
        {
          accessorKey: "partSection",
          header: "#",
          size: 30,
        },
        {
          accessorKey: "name",
          header: t("exercise"),
        },
        {
          accessorKey: "points",
          header: t("points"),
          size: 50,
        },
        {
          id: "status",
          accessorKey: "completed",
          header: t("exerciseStatus"),
          Cell: renderCheck({ success: t("completed") }),
          columns: [
            {
              accessorKey: "completed",
              header: t("completed"),
              size: 50,
              Header: renderHeader({ tooltip: t("completedTooltip") }),
              Cell: renderCheck({ success: t("completed") }),
            },
            {
              accessorKey: "attempted",
              header: t("attempted"),
              size: 50,
              Header: renderHeader({ tooltip: t("attemptedTooltip") }),
              Cell: renderCheck({ success: t("attempted") }),
            },
            {
              accessorKey: "exercise_completion_required_actions",
              header: t("requiredActions"),
              size: 80,
              Header: renderHeader({ tooltip: t("requiredActionsTooltip") }),
              Cell: renderRequiredActions(t),
            },
          ],
        },
      ]
    }

    return [
      {
        accessorKey: "partSection",
        header: t("partSection"),
        Cell: renderNarrowCellFn,
      },
      {
        accessorKey: "name",
        header: t("exercise"),
        Cell: renderNarrowCellFn,
      },
      {
        accessorKey: "points",
        header: t("points"),
        Cell: renderNarrowCellFn,
      },
      {
        accessorKey: "completed",
        header: t("completed"),
        Header: renderHeader({ tooltip: t("completedTooltip") }),
        Cell: renderNarrowCheck({
          success: t("completed"),
          failure: t("notCompleted"),
        }),
      },
      {
        accessorKey: "attempted",
        header: t("attempted"),
        Header: renderHeader({ tooltip: t("attemptedTooltip") }),
        Cell: renderNarrowCheck({
          success: t("attempted"),
          failure: t("notAttempted"),
        }),
      },
      {
        accessorKey: "exercise_completion_required_actions",
        header: t("requiredActions"),
        Header: renderHeader({ tooltip: t("requiredActionsTooltip") }),
        Cell: renderNarrowRequiredActions(t),
      },
      {
        accessorKey: "created_at",
        header: t("createdAt"),
        Cell: (props) =>
          props.row.original.exercise_completions.length
            ? renderNarrowCellFn(props)
            : undefined,
        muiTableBodyCellProps: hideCellIfNoExerciseCompletions,
      },
      {
        accessorKey: "timestamp",
        header: t("timestamp"),
        Cell: (props) =>
          props.row.original.exercise_completions.length
            ? renderNarrowCellFn(props)
            : undefined,
        muiTableBodyCellProps: hideCellIfNoExerciseCompletions,
      },
    ]
  }, [locale, t, isNarrow])

  const rows = useMemo(() => {
    const localeMapExerciseToRow = mapExerciseToRow(locale)

    return (data ?? []).map(localeMapExerciseToRow)
  }, [locale, data])

  const getExpandButtonProps = useCallback(
    ({ row }: { row: MRT_Row<ExerciseRow> }) =>
      isNarrow || (row.original.exercise_completions ?? []).length === 0
        ? {
            sx: {
              display: "none",
            },
          }
        : {},
    [isNarrow],
  )

  const renderExerciseInfo = useCallback(
    ({ row }: { row: MRT_Row<ExerciseRow> }) =>
      !isNarrow ? <ExerciseInfo exercise={row.original} /> : undefined,
    [isNarrow],
  )

  const tableProps = useExerciseListProps<ExerciseRow>()
  const localization = useMaterialReactTableLocalization(locale)
  const muiTableBodyRowProps = useCallback(
    ({ row }: { row: MRT_Row<ExerciseRow> }) => ({
      ...tableProps["muiTableBodyRowProps"],
      sx: {
        ...(tableProps["muiTableBodyRowProps"] as TableRowProps)?.sx,
        ...(row.original.max_points === 0 ? { backgroundColor: "#eee" } : {}),
      },
    }),
    [tableProps],
  )

  return (
    <ExerciseListSummaryCard>
      <MaterialReactTable<ExerciseRow>
        {...tableProps}
        muiTableBodyRowProps={muiTableBodyRowProps}
        data={rows}
        columns={columns}
        renderTopToolbarCustomActions={ExerciseListTitle}
        muiExpandButtonProps={getExpandButtonProps}
        renderDetailPanel={renderExerciseInfo}
        localization={localization}
        initialState={{
          isLoading: true,
          pagination: { pageIndex: 0, pageSize: 30 },
        }}
        tableInstanceRef={tableInstanceRef}
        positionPagination={
          (tableInstanceRef?.current?.getState()?.pagination?.pageSize ?? 30) >
          10
            ? "both"
            : "bottom"
        }
        state={{
          isLoading: loading || (!loading && !data?.length),
          // TODO: will this show loading on no data, or do we not render exerciselist at all then?
        }}
      />
    </ExerciseListSummaryCard>
  )
}

export default ExerciseList
