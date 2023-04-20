import { useCallback, useMemo } from "react"

import type {
  MUIDataTableColumn,
  MUIDataTableExpandButton,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables"
import { useRouter } from "next/router"

import { TableCell, TableRow, Typography } from "@mui/material"

import { ExerciseRow, renderRequiredActions } from "./common"
import ExerciseInfo from "./ExerciseInfo"
import {
  ExpandButton,
  ExpandButtonPlaceholder,
  MUIDataTable,
  renderCheck,
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

  const columns = useMemo(
    (): Array<MUIDataTableColumn> => [
      {
        name: "part",
        label: t("part"),
        options: {
          display: false,
        },
      },
      {
        name: "section",
        label: t("section"),
        options: {
          display: false,
        },
      },
      {
        name: "partSection",
        label: t("partSection"),
      },
      {
        name: "name",
        label: t("exercise"),
        options: {
          setCellHeaderProps: () => ({ sx: { width: "15em" } }),
        },
      },
      {
        name: "points",
        label: t("points"),
      },
      {
        name: "completed",
        label: t("completed"),
        options: {
          customBodyRender: renderCheck(t("completed")),
          setCellHeaderProps: () => ({ sx: { width: "4em" } }),
        },
      },
      {
        name: "attempted",
        label: t("attempted"),
        options: {
          customBodyRender: renderCheck(t("attempted")),
          setCellHeaderProps: () => ({ sx: { width: "4em" } }),
        },
      },
      {
        name: "exercise_completion_required_actions",
        label: t("requiredActions"),
        options: {
          customBodyRender: renderRequiredActions(t),
        },
      },
      {
        name: "created_at",
        label: t("createdAt"),
        options: {
          display: false,
        },
      },
      {
        name: "timestamp",
        label: t("timestamp"),
        options: {
          display: false,
        },
      },
    ],
    [locale, t],
  )

  const rows = useMemo(
    () => exercises.map(mapExerciseToRow(locale)),
    [locale, exercises],
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
      <MUIDataTable
        title={<Typography variant="h3">{t("exercises")}</Typography>}
        data={rows}
        columns={columns}
        options={options}
        components={components}
      />
    </SummaryCard>
  )
}

export default ExerciseList
