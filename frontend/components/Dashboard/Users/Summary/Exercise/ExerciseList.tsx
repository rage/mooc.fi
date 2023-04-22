import { useCallback, useMemo } from "react"

import { sortBy } from "lodash"
import type { MRT_ColumnDef, MRT_Row } from "material-react-table"
import { useRouter } from "next/router"

import { Theme, Typography, useMediaQuery } from "@mui/material"

import { useUserPointsSummaryContext } from "../contexts"
import {
  ExerciseRow,
  renderCheck,
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

import {
  ExerciseCompletionCoreFieldsFragment,
  ExerciseCoreFieldsFragment,
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

type ExerciseWithCompletions = ExerciseCoreFieldsFragment & {
  exercise_completions: ExerciseCompletionCoreFieldsFragment[]
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

interface ExerciseListProps {
  data?:
    | UserCourseSummaryCoreFieldsFragment
    | UserTierCourseSummaryCoreFieldsFragment
  loading?: boolean
}

function ExerciseList({ data }: ExerciseListProps) {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))
  const { loading } = useUserPointsSummaryContext()

  const exercises = useMemo(
    () =>
      sortBy(
        (data?.course?.exercises ?? []).map((exercise) => ({
          ...exercise,
          exercise_completions: (data?.exercise_completions ?? []).filter(
            (ec) => ec?.exercise_id === exercise.id,
          ),
        })),
        ["part", "section", "name"],
      ),
    [data],
  )

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
          size: 160,
        },
        {
          accessorKey: "points",
          header: t("points"),
          size: 50,
        },
        {
          id: "status",
          accessorKey: "completed",
          header: "kissa",
          Cell: renderCheck(t("completed")),
          columns: [
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
          ],
        },
      ]
    }

    return [
      {
        accessorKey: "partSection",
        header: t("partSection"),
        Cell: renderNarrowCell,
      },
      {
        accessorKey: "name",
        header: t("exercise"),
        Cell: renderNarrowCell,
      },
      {
        accessorKey: "points",
        header: t("points"),
        Cell: renderNarrowCell,
      },
      {
        accessorKey: "completed",
        header: t("completed"),
        Cell: renderNarrowCheck(t("completed"), t("notCompleted")),
      },
      {
        accessorKey: "attempted",
        header: t("attempted"),
        Cell: renderNarrowCheck(t("attempted"), t("notAttempted")),
      },
      {
        accessorKey: "exercise_completion_required_actions",
        header: t("requiredActions"),
        Cell: renderNarrowRequiredActions(t),
      },
      // TODO: add conditional date rows = ExerciseInfo
    ]
  }, [locale, t, isNarrow])

  const localeMapExerciseToRow = useMemo(
    () => mapExerciseToRow(locale),
    [locale],
  )
  const rows: Array<ExerciseRow> = useMemo(
    () => exercises.map(localeMapExerciseToRow),
    [localeMapExerciseToRow, exercises, isNarrow],
  )

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

  // TODO: use mrt here as well?
  const renderExerciseInfo = useCallback(
    ({ row }: { row: MRT_Row<ExerciseRow> }) =>
      !isNarrow ? <ExerciseInfo exercise={row.original} /> : undefined,
    [isNarrow],
  )

  const title = useCallback(
    () => <Typography variant="h3">{t("exercises")}</Typography>,
    [t],
  )

  const tableProps = useExerciseListProps<ExerciseRow>()
  const localization = useMaterialReactTableLocalization(locale)

  return (
    <SummaryCard sx={{ padding: "0.5rem" }}>
      <MaterialReactTable<ExerciseRow>
        {...tableProps}
        data={rows}
        columns={columns}
        renderTopToolbarCustomActions={title}
        muiExpandButtonProps={getExpandButtonProps}
        renderDetailPanel={renderExerciseInfo}
        localization={localization}
        state={{
          isLoading: loading,
        }}
      />
    </SummaryCard>
  )
}

export default ExerciseList
