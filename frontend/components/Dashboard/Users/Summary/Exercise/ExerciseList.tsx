import { useMemo } from "react"

import { useRouter } from "next/router"

import { Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ExerciseRow,
  renderCheck,
  renderNarrowCell,
  renderNarrowCheck,
  renderNarrowRequiredActions,
  renderRequiredActions,
} from "./common"
import ExerciseInfo from "./ExerciseInfo"
import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import SummaryTable, {
  createSummaryColumnHelper,
} from "/components/Dashboard/Users/Summary/SummaryTable"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

import { ExerciseWithExerciseCompletionsFieldsFragment } from "/graphql/generated"

const mapExerciseToRow =
  (locale?: string) =>
  (exercise: ExerciseWithExerciseCompletionsFieldsFragment): ExerciseRow => {
    const exerciseCompletions = exercise.exercise_completions ?? []
    const exerciseCompletion = exerciseCompletions[0]

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
      completed: exerciseCompletions.some((e) => e.completed),
      attempted: exerciseCompletions.some((e) => e.attempted),
      exercise_completion_required_actions:
        exerciseCompletion?.exercise_completion_required_actions ?? [],
      created_at,
      timestamp,
      exercise_completions: exerciseCompletions,
    }
  }

interface ExerciseListProps {
  /** Without data, the list renders as a loading placeholder. */
  data?: Array<ExerciseWithExerciseCompletionsFieldsFragment> | null
  loading?: boolean
}

const columnHelper = createSummaryColumnHelper<ExerciseRow>()
const renderNarrowValue = renderNarrowCell()
const COMPLETION_DATE_COLUMN_IDS = ["created_at", "timestamp"]

const ExerciseListSummaryCard = styled(SummaryCard)`
  padding: 0.5rem;
`

const hasExerciseCompletions = (row: ExerciseRow) =>
  row.exercise_completions.length > 0

function ExerciseList({ data, loading }: ExerciseListProps) {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo(() => {
    if (!isNarrow) {
      return columnHelper.columns([
        columnHelper.accessor("partSection", { header: "#", size: 30 }),
        columnHelper.accessor("name", { header: t("exercise") }),
        columnHelper.accessor("points", { header: t("points"), size: 50 }),
        columnHelper.group({
          id: "status",
          header: t("exerciseStatus"),
          columns: columnHelper.columns([
            columnHelper.accessor("completed", {
              header: t("completed"),
              size: 50,
              meta: { headerTooltip: t("completedTooltip") },
              cell: renderCheck({ success: t("completed") }),
            }),
            columnHelper.accessor("attempted", {
              header: t("attempted"),
              size: 50,
              meta: { headerTooltip: t("attemptedTooltip") },
              cell: renderCheck({ success: t("attempted") }),
            }),
            columnHelper.accessor("exercise_completion_required_actions", {
              header: t("requiredActions"),
              size: 80,
              meta: { headerTooltip: t("requiredActionsTooltip") },
              cell: renderRequiredActions,
            }),
          ]),
        }),
      ])
    }

    return columnHelper.columns([
      columnHelper.accessor("partSection", {
        header: t("partSection"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("name", {
        header: t("exercise"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("points", {
        header: t("points"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("completed", {
        header: t("completed"),
        cell: renderNarrowCheck({
          success: t("completed"),
          failure: t("notCompleted"),
        }),
      }),
      columnHelper.accessor("attempted", {
        header: t("attempted"),
        cell: renderNarrowCheck({
          success: t("attempted"),
          failure: t("notAttempted"),
        }),
      }),
      columnHelper.accessor("exercise_completion_required_actions", {
        header: t("requiredActions"),
        cell: renderNarrowRequiredActions,
      }),
      columnHelper.accessor("created_at", {
        header: t("createdAt"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("timestamp", {
        header: t("timestamp"),
        cell: renderNarrowValue,
      }),
    ])
  }, [t, isNarrow])

  const rows = useMemo(
    () => (data ?? []).map(mapExerciseToRow(locale)),
    [locale, data],
  )

  return (
    <ExerciseListSummaryCard>
      <SummaryTable
        data={rows}
        columns={columns}
        title={<Typography variant="h3">{t("exercises")}</Typography>}
        isLoading={loading || !data}
        isPaginated
        isSearchable
        renderDetailPanel={(row) => <ExerciseInfo exercise={row} />}
        getRowCanExpand={hasExerciseCompletions}
        getRowBackgroundColor={(row) =>
          row.max_points === 0 ? "#eee" : undefined
        }
        isCellHidden={(cell) =>
          COMPLETION_DATE_COLUMN_IDS.includes(cell.column.id) &&
          !hasExerciseCompletions(cell.row.original)
        }
      />
    </ExerciseListSummaryCard>
  )
}

export default ExerciseList
