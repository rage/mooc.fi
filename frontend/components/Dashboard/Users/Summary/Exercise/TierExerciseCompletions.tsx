import { useMemo } from "react"

import { MRT_ColumnDef } from "material-react-table"
import { useRouter } from "next/router"

import { Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  MaterialReactTable,
  useMaterialReactTableLocalization,
} from "../common"
import {
  renderCheck,
  renderHeader,
  renderNarrowCell,
  renderNarrowCheck,
  renderNarrowRequiredActions,
  renderRequiredActions,
  TierExerciseCompletionRow,
  useExerciseListProps,
} from "./common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

interface TierExerciseCompletionProps {
  data: Array<TierExerciseCompletionRow>
  highestTier?: number
  points?: number
}

const EmphasizedValue = styled("span")`
  font-weight: 800;
`

const mapDataToRow = (locale?: string) => (ec: TierExerciseCompletionRow) => {
  const created_at = ec.created_at
    ? formatDateTime(ec.created_at, locale)
    : undefined
  const timestamp = ec.timestamp
    ? formatDateTime(ec.timestamp, locale)
    : undefined
  return {
    ...ec,
    created_at,
    timestamp,
  }
}

const getRenderTierCell =
  (highestTier?: number): MRT_ColumnDef<TierExerciseCompletionRow>["Cell"] =>
  (props) => {
    if (props.cell.getValue<number>() === highestTier) {
      return <EmphasizedValue>{props.cell.getValue<number>()}</EmphasizedValue>
    }
    return props.cell.getValue<number>()
  }

const getRenderPointsCell =
  (points?: number): MRT_ColumnDef<TierExerciseCompletionRow>["Cell"] =>
  (props) => {
    if (props.cell.getValue<number>() === points) {
      return <EmphasizedValue>{props.cell.getValue<number>()}</EmphasizedValue>
    }
    return props.cell.getValue<number>()
  }

const getRenderTierCellStyle =
  (highestTier?: number) =>
  (
    props: Parameters<
      NonNullable<MRT_ColumnDef<TierExerciseCompletionRow>["Cell"]>
    >[0],
  ) =>
    props.cell.getValue<number>() === highestTier ? { fontWeight: 800 } : {}

const getRenderPointsCellStyle =
  (points?: number) =>
  (
    props: Parameters<
      NonNullable<MRT_ColumnDef<TierExerciseCompletionRow>["Cell"]>
    >[0],
  ) => (props.cell.getValue<number>() === points ? { fontWeight: 800 } : {})

const TierExerciseCompletionsTitle = () => {
  const t = useTranslator(ProfileTranslations)

  return (
    <Typography variant="body2" fontWeight="bold">
      {t("submissions")}
    </Typography>
  )
}

const TierExerciseCompletions = ({
  data,
  highestTier,
  points,
}: TierExerciseCompletionProps) => {
  const { locale } = useRouter()
  const t = useTranslator(ProfileTranslations)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))
  const renderTierCell = getRenderTierCell(highestTier)
  const renderPointsCell = getRenderPointsCell(points)
  const renderNarrowTierCell = renderNarrowCell({
    ValueProps: getRenderTierCellStyle(highestTier),
  })
  const renderNarrowPointsCell = renderNarrowCell({
    ValueProps: getRenderPointsCellStyle(points),
  })

  const columns = useMemo((): Array<
    MRT_ColumnDef<TierExerciseCompletionRow>
  > => {
    if (!isNarrow) {
      return [
        {
          accessorKey: "timestamp",
          header: t("submissionDate"),
          size: 40,
        },
        {
          accessorKey: "tier",
          header: t("tier"),
          size: 20,
          Cell: renderTierCell,
        },
        {
          accessorKey: "n_points",
          header: t("points"),
          size: 20,
          Cell: renderPointsCell,
        },
        {
          accessorKey: "completed",
          header: t("completed"),
          size: 20,
          Header: renderHeader({ tooltip: t("completedTooltip") }),
          Cell: renderCheck({ success: t("completed") }),
        },
        {
          accessorKey: "exercise_completion_required_actions",
          header: t("requiredActions"),
          size: 100,
          Header: renderHeader({ tooltip: t("requiredActionsTooltip") }),
          Cell: renderRequiredActions(t),
        },
      ]
    }

    return [
      {
        accessorKey: "timestamp",
        header: t("submissionDate"),
        Cell: renderNarrowCell(),
      },
      {
        accessorKey: "tier",
        header: t("tier"),
        Cell: renderNarrowTierCell,
      },
      {
        accessorKey: "n_points",
        header: t("points"),
        Cell: renderNarrowPointsCell,
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
        accessorKey: "exercise_completion_required_actions",
        header: t("requiredActions"),
        Header: renderHeader({ tooltip: t("requiredActionsTooltip") }),
        Cell: renderNarrowRequiredActions(t),
      },
    ]
  }, [locale, t, isNarrow, renderNarrowCell])

  const rows: Array<TierExerciseCompletionRow> = useMemo(() => {
    const localeMapDataToRow = mapDataToRow(locale)
    return (data ?? []).map(localeMapDataToRow)
  }, [locale, data])
  const tableProps = useExerciseListProps<TierExerciseCompletionRow>()
  const localization = useMaterialReactTableLocalization(locale)

  return (
    <MaterialReactTable<TierExerciseCompletionRow>
      {...tableProps}
      data={rows}
      columns={columns}
      layoutMode="grid"
      enableDensityToggle={false}
      enableFilters={false}
      enableHiding={false}
      enableFullScreenToggle={false}
      enablePagination={false}
      enableColumnActions={false}
      renderTopToolbarCustomActions={
        !isNarrow ? TierExerciseCompletionsTitle : undefined
      }
      localization={localization}
    />
  )
}

export default TierExerciseCompletions
