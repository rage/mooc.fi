import { useMemo } from "react"

import { Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import { SummaryCard } from "../common"
import { useSelectedData } from "../contexts"
import SummaryTable, {
  createSummaryColumnHelper,
  getColumnLabel,
} from "../SummaryTable"
import {
  NarrowCell,
  renderCheck,
  renderNarrowCell,
  renderNarrowCheck,
  TierExerciseRow,
} from "./common"
import TierExerciseCompletions from "./TierExerciseCompletions"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { TierProgressFieldsFragment } from "/graphql/generated"

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

const Column = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const columnHelper = createSummaryColumnHelper<TierExerciseRow>()
const renderNarrowValue = renderNarrowCell()

const renderTierExerciseCompletions = (row: TierExerciseRow) => (
  <TierExerciseCompletions
    data={row.exercise_completions}
    highestTier={row.tier}
    points={row.n_points}
  />
)

const hasExerciseCompletions = (row: TierExerciseRow) =>
  row.exercise_completions.length > 0

const TierExerciseList = () => {
  const selectedData = useSelectedData()
  const data = selectedData?.user_course_progress?.extra?.exercises
  const t = useTranslator(ProfileTranslations)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo(() => {
    if (!isNarrow) {
      return columnHelper.columns([
        columnHelper.accessor("exercise_number", { header: "#", size: 20 }),
        columnHelper.accessor("name", { header: t("exercise"), size: 160 }),
        columnHelper.accessor("tier", { header: t("tier"), size: 40 }),
        columnHelper.accessor("points", { header: t("points"), size: 50 }),
        columnHelper.accessor("completed", {
          header: t("completed"),
          size: 40,
          meta: { headerTooltip: t("completedTooltip") },
          cell: renderCheck({ success: t("completed") }),
        }),
      ])
    }

    return columnHelper.columns([
      columnHelper.accessor("exercise_number", {
        header: "#",
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("name", {
        header: t("exercise"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("tier", {
        header: t("tier"),
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
      columnHelper.accessor("exercise_completions", {
        header: t("submissions"),
        cell: (props) =>
          hasExerciseCompletions(props.row.original) ? (
            <Column>
              <NarrowCell header={getColumnLabel(props)} />
              {renderTierExerciseCompletions(props.row.original)}
            </Column>
          ) : null,
      }),
    ])
  }, [t, isNarrow])

  const rows = useMemo(() => (data ?? []).map(mapExerciseToRow), [data])

  return (
    <SummaryCard>
      <SummaryTable
        data={rows}
        columns={columns}
        title={<Typography variant="h3">{t("combinedExercises")}</Typography>}
        isSearchable
        renderDetailPanel={renderTierExerciseCompletions}
        getRowCanExpand={hasExerciseCompletions}
      />
    </SummaryCard>
  )
}

export default TierExerciseList
