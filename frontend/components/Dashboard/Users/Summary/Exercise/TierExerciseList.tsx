import { useCallback, useMemo } from "react"

import { MRT_ColumnDef } from "material-react-table"
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
  ExpandButton,
  ExpandButtonPlaceholder,
  MaterialReactTable,
  MUIDataTable,
  SummaryCard,
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
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo((): Array<
    MRT_ColumnDef<Partial<TierExerciseRow>>
  > => {
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
        size: 40,
        Cell: renderNarrowCheck(t("completed"), t("notCompleted")),
      },
    ]
  }, [locale, t, isNarrow])

  const rows = useMemo(() => (data ?? []).map(mapExerciseToRow), [data])

  /*const createOptions = useCallback(
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
  )*/

  const title = useCallback(
    () => <Typography variant="h3">{t("exercises")}</Typography>,
    [t],
  )

  const tableProps = useExerciseListProps()

  return (
    <SummaryCard>
      <MaterialReactTable
        data={rows}
        columns={columns}
        layoutMode="grid"
        enablePagination={false}
        enableColumnActions={false}
        renderTopToolbarCustomActions={title}
        {...tableProps}
      />
    </SummaryCard>
  )
}

export default TierExerciseList
