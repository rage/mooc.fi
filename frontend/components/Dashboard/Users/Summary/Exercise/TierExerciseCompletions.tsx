import { useCallback, useMemo } from "react"

import {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_TableInstance,
} from "material-react-table"
import { useRouter } from "next/router"

import {
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  MaterialReactTable,
  useMaterialReactTableLocalization,
} from "../common"
import {
  mergeOriginalCellProps,
  mergeOriginalMuiProps,
  renderCheck,
  renderCheckBase,
  renderNarrowCell,
  renderNarrowCheck,
  renderNarrowRequiredActions,
  renderRequiredActions,
  renderRequiredActionsBase,
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
  ) =>
    props.cell.getValue<number>() === points ? { fontWeight: 800 } : {}

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
    valueProps: getRenderTierCellStyle(highestTier),
  })
  const renderNarrowPointsCell = renderNarrowCell({
    valueProps: getRenderPointsCellStyle(points),
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
          Cell: renderCheck({ success: t("completed") }),
        },
        {
          accessorKey: "exercise_completion_required_actions",
          header: t("requiredActions"),
          size: 100,
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
        Cell: renderNarrowCheck({
          success: t("completed"),
          failure: t("notCompleted"),
        }),
      },
      {
        accessorKey: "exercise_completion_required_actions",
        header: t("requiredActions"),
        Cell: renderNarrowRequiredActions(t),
      },
    ]
  }, [locale, t, isNarrow, renderNarrowCell])

  console.log(columns)
  const rows: Array<TierExerciseCompletionRow> = useMemo(() => {
    const localeMapDataToRow = mapDataToRow(locale)
    return (data ?? []).map(localeMapDataToRow)
  }, [locale, data])
  const title = useCallback(
    () => (
      <Typography variant="body2" fontWeight="bold">
        {t("submissions")}
      </Typography>
    ),
    [t],
  )
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
      renderTopToolbarCustomActions={title}
      localization={localization}
    />
  )
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("submissionDate")}</TableCell>
          <TableCell>{t("tier")}</TableCell>
          <TableCell>{t("points")}</TableCell>
          <TableCell>{t("completed")}</TableCell>
          <TableCell>{t("requiredActions")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((ec) => (
          <TableRow key={ec.id}>
            <TableCell>
              {formatDateTime(ec.timestamp, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
            <TableCell
              style={{
                fontWeight: ec.tier === highestTier ? "800" : undefined,
              }}
            >
              {ec.tier}
            </TableCell>
            <TableCell
              style={{ fontWeight: ec.n_points === points ? "800" : undefined }}
            >
              {ec.points}
            </TableCell>
            <TableCell>
              {renderCheckBase(t("completed"))(ec.completed ?? false)}
            </TableCell>
            <TableCell>
              {renderRequiredActionsBase(t)(
                ec.exercise_completion_required_actions,
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TierExerciseCompletions
