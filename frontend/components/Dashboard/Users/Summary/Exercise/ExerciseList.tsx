import { useCallback, useMemo } from "react"

import type { MRT_ColumnDef } from "material-react-table"
import type {
  MUIDataTableColumn,
  MUIDataTableExpandButton,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables"
import { useRouter } from "next/router"

import {
  TableCell,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material"

import {
  ExerciseRow,
  renderCheck,
  renderMobileCell,
  renderMobileCheck,
  renderMobileRequiredActions,
  renderRequiredActions,
} from "./common"
import ExerciseInfo from "./ExerciseInfo"
import {
  ExpandButton,
  ExpandButtonPlaceholder,
  MaterialReactTable,
  SummaryCard,
} from "/components/Dashboard/Users/Summary/common"
import { useTranslator } from "/hooks/useTranslator"
import { Translator } from "/translations"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"
import notEmpty from "/util/notEmpty"

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
} from "/graphql/generated"

type ExerciseWithCompletions = ExerciseCoreFieldsFragment & {
  exercise_completions: ExerciseCompletionCoreFieldsFragment[]
}
interface ExerciseListProps {
  exercises: Array<ExerciseWithCompletions>
}

const mapExerciseToRow =
  (locale?: string) =>
  (exercise: ExerciseWithCompletions): ExerciseRow => {
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
      completed:
        exercise.exercise_completions?.some((e) => e.completed) ?? false,
      attempted:
        exercise.exercise_completions?.some((e) => e.attempted) ?? false,
      exercise_completion_required_actions:
        exerciseCompletion?.exercise_completion_required_actions ?? [],
      created_at,
      timestamp,
      exercise_completions: exercise.exercise_completions,
    }
  }

function ExerciseList({ exercises }: ExerciseListProps) {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo((): Array<MRT_ColumnDef<Partial<ExerciseRow>>> => {
    if (!isMobile) {
      return [
        {
          accessorKey: "partSection",
          header: "#",
          size: 30,
        },
        {
          accessorKey: "name",
          header: t("exercise"),
          size: 160,
        },
        {
          accessorKey: "points",
          header: t("points"),
          size: 50,
        },
        {
          accessorKey: "completed",
          header: t("completed"),
          size: 40,
          Cell: renderCheck(t("completed")),
        },
        {
          accessorKey: "attempted",
          header: t("attempted"),
          size: 40,
          Cell: renderCheck(t("attempted")),
        },
        {
          accessorKey: "exercise_completion_required_actions",
          header: t("requiredActions"),
          size: 100,
          Cell: renderRequiredActions(t),
        },
      ]
    }

    console.log("isMobile", isMobile)
    return [
      {
        accessorKey: "partSection",
        header: t("partSection"),
        Cell: renderMobileCell,
      },
      {
        accessorKey: "name",
        header: t("exercise"),
        Cell: renderMobileCell,
      },
      {
        accessorKey: "points",
        header: t("points"),
        Cell: renderMobileCell,
      },
      {
        accessorKey: "completed",
        header: t("completed"),
        Cell: renderMobileCheck(t("completed"), t("notCompleted")),
      },
      {
        accessorKey: "attempted",
        header: t("attempted"),
        Cell: renderMobileCheck(t("attempted"), t("notAttempted")),
      },
      {
        accessorKey: "exercise_completion_required_actions",
        header: t("requiredActions"),
        Cell: renderMobileRequiredActions(t),
      },
    ]
  }, [locale, t, isMobile])

  const rows = useMemo(
    () => exercises.map(mapExerciseToRow(locale)),
    [locale, exercises, isMobile],
  )

  const options = useMemo(
    (): MUIDataTableOptions => ({
      expandableRows: true,
      pagination: false,
      selectableRows: "none",
      setTableProps: () => ({
        style: {
          tableLayout: "fixed",
        },
      }),
      isRowExpandable: (dataIndex) => {
        return (rows[dataIndex]?.exercise_completions ?? []).length > 0
      },
      renderExpandableRow: (rowData, { rowIndex }) => {
        return (
          <TableRow>
            <TableCell colSpan={rowData.length + 1}>
              <ExerciseInfo exercise={rows[rowIndex]} />
            </TableCell>
          </TableRow>
        )
      },
    }),
    [rows],
  )

  const ConditionalExpandButton = useCallback(
    (props: MUIDataTableExpandButton) => {
      if (
        !notEmpty(props.dataIndex) ||
        (rows[props.dataIndex]?.exercise_completions ?? []).length == 0
      ) {
        return <ExpandButtonPlaceholder />
      }
      return <ExpandButton {...props} />
    },
    [rows],
  )

  const components: MUIDataTableProps["components"] = useMemo(
    () => ({
      ExpandButton: ConditionalExpandButton,
    }),
    [ConditionalExpandButton],
  )

  return (
    <SummaryCard>
      <MaterialReactTable
        data={rows}
        columns={columns}
        layoutMode="grid"
        enablePagination={false}
        enableColumnActions={false}
        muiTableProps={{
          sx: {
            tableLayout: "fixed",
          },
        }}
        muiTableHeadProps={{
          sx: {
            ...(isMobile && { display: "none" }),
          },
        }}
        muiTableBodyRowProps={{
          sx: {
            ...(isMobile && {
              margin: "0.5rem",
              flexDirection: "column",
              border: "1px solid rgba(224, 224, 244, 1)",
              borderRadius: "4px",
            }),
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            ...(isMobile && {
              width: "100%",
              borderBottom: "none",
              padding: "0.5rem",
            }),
          },
        }}
      />
    </SummaryCard>
  )
}

export default ExerciseList
