import { useCallback, useMemo } from "react"

import { MRT_ColumnDef, MRT_Row } from "material-react-table"
import { useRouter } from "next/router"

import { Theme, Typography, useMediaQuery } from "@mui/material"

import {
  MaterialReactTable,
  SummaryCard,
  useMaterialReactTableLocalization,
} from "../common"
import {
  renderCheck,
  renderNarrowCell,
  renderNarrowCheck,
  TierExerciseRow,
  useExerciseListProps,
} from "./common"
import TierExerciseCompletions from "./TierExerciseCompletions"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { TierProgressFieldsFragment } from "/graphql/generated"

interface TierExerciseListProps {
  data?: Array<TierProgressFieldsFragment>
  loading?: boolean
}

const mapExerciseToRow = (
  exercise: TierProgressFieldsFragment,
): TierExerciseRow => ({
  ...exercise,
  id: exercise.custom_id ?? "",
  name: exercise.name ?? "",
  points: `${Math.round(exercise.n_points * 100) / 100}/${exercise.max_points}`,
  exercise_completions: (exercise.exercise_completions ?? []).map((ec) => ({
    ...ec,
    points: `${Math.round((ec.n_points ?? 0) * 100) / 100}/${
      ec.max_points ?? 0
    }`,
    exercise_completion_required_actions:
      ec.exercise_completion_required_actions ?? [],
  })),
  completed: exercise.exercise_completions?.some((e) => e.completed) ?? false,
})

const TierExerciseList = ({ data }: TierExerciseListProps) => {
  const { locale } = useRouter()
  const t = useTranslator(ProfileTranslations)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo((): Array<MRT_ColumnDef<TierExerciseRow>> => {
    if (!isNarrow) {
      return [
        {
          accessorKey: "exercise_number",
          header: "#",
          size: 20,
        },
        {
          accessorKey: "name",
          header: t("exercise"),
          size: 160,
        },
        {
          accessorKey: "tier",
          header: t("tier"),
          size: 40,
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
      ]
    }

    return [
      {
        accessorKey: "exercise_number",
        header: "#",
        Cell: renderNarrowCell,
      },
      {
        accessorKey: "name",
        header: t("exercise"),
        Cell: renderNarrowCell,
      },
      {
        accessorKey: "tier",
        header: t("tier"),
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
      // TODO: add conditional exercise completion rows = renderDetailPanel
    ]
  }, [locale, t, isNarrow])

  const rows: Array<TierExerciseRow> = useMemo(
    () => (data ?? []).map(mapExerciseToRow),
    [data],
  )

  const getExpandButtonProps = useCallback(
    ({ row }: { row: MRT_Row<TierExerciseRow> }) =>
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
  const renderTierExerciseCompletions = useCallback(
    ({ row }: { row: MRT_Row<TierExerciseRow> }) =>
      !isNarrow ? (
        <TierExerciseCompletions
          data={row.original.exercise_completions}
          highestTier={row.original.tier}
          points={row.original.n_points}
        />
      ) : undefined,
    [isNarrow],
  )

  const title = useCallback(
    () => <Typography variant="h3">{t("exercises")}</Typography>,
    [t],
  )

  const tableProps = useExerciseListProps<TierExerciseRow>()
  const localization = useMaterialReactTableLocalization(locale)

  return (
    <SummaryCard>
      <MaterialReactTable<TierExerciseRow>
        {...tableProps}
        data={rows}
        columns={columns}
        layoutMode="grid"
        enablePagination={false}
        enableColumnActions={false}
        renderTopToolbarCustomActions={title}
        muiExpandButtonProps={getExpandButtonProps}
        renderDetailPanel={renderTierExerciseCompletions}
        localization={localization}
      />
    </SummaryCard>
  )
}

export default TierExerciseList
