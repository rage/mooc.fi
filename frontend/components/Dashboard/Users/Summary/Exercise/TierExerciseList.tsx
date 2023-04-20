import { useCallback, useMemo } from "react"

import type {
  MUIDataTableColumn,
  MUIDataTableExpandButton,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables"
import { useRouter } from "next/router"

import { TableCell, TableRow, Typography } from "@mui/material"

import {
  ExpandButton,
  ExpandButtonPlaceholder,
  MUIDataTable,
  renderCheck,
  SummaryCard,
} from "../common"
import { TierExerciseRow } from "./common"
import TierExerciseCompletions from "./TierExerciseCompletions"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import notEmpty from "/util/notEmpty"

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

  const columns: Array<MUIDataTableColumn> = useMemo(
    () => [
      {
        name: "exercise_number",
        label: "#",
      },
      {
        name: "name",
        label: t("exercise"),
        width: 300,
      },
      {
        name: "tier",
        label: t("tier"),
        width: 25,
      },
      {
        name: "points",
        label: t("points"),
      },
      {
        name: "completed",
        label: t("completed"),
        width: 25,
        options: {
          customBodyRender: renderCheck(t("completed")),
        },
      },
    ],
    [locale, t],
  )

  const rows = useMemo(() => (data ?? []).map(mapExerciseToRow), [data])

  const createOptions = useCallback(
    (dataRows: typeof rows): MUIDataTableOptions => ({
      expandableRows: true,
      pagination: false,
      selectableRows: "none",
      isRowExpandable: (dataIndex) => {
        return (dataRows[dataIndex]?.exercise_completions ?? []).length > 0
      },
      renderExpandableRow: (rowData, { rowIndex }) => {
        return (
          <TableRow>
            <TableCell colSpan={rowData.length + 1}>
              <TierExerciseCompletions
                data={dataRows[rowIndex].exercise_completions}
                highestTier={dataRows[rowIndex].tier}
                points={dataRows[rowIndex].n_points}
              />
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
        options={createOptions(rows)}
        components={components}
      />
    </SummaryCard>
  )
}

export default TierExerciseList
