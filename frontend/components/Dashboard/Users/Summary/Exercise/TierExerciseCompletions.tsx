import { useMemo } from "react"

import { useRouter } from "next/router"

import { Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import SummaryTable, {
  createSummaryColumnHelper,
  SummaryCellProps,
} from "../SummaryTable"
import {
  renderCheck,
  renderNarrowCell,
  renderNarrowCheck,
  renderNarrowRequiredActions,
  renderRequiredActions,
  TierExerciseCompletionRow,
} from "./common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"

interface TierExerciseCompletionProps {
  data: Array<TierExerciseCompletionRow>
  /** Tier value to emphasize. */
  highestTier?: number
  /** Points value to emphasize. */
  points?: number
}

const EmphasizedValue = styled("span")`
  font-weight: 800;
`

const mapDataToRow =
  (locale?: string) =>
  (ec: TierExerciseCompletionRow): TierExerciseCompletionRow => ({
    ...ec,
    created_at: ec.created_at
      ? formatDateTime(ec.created_at, locale)
      : undefined,
    timestamp: ec.timestamp ? formatDateTime(ec.timestamp, locale) : undefined,
  })

const renderNarrowValue = renderNarrowCell()

const renderEmphasizedIfEqual =
  (emphasizedValue?: number) =>
  ({ getValue }: SummaryCellProps<number | null>) => {
    const value = getValue()

    return value === emphasizedValue ? (
      <EmphasizedValue>{value}</EmphasizedValue>
    ) : (
      value
    )
  }

const renderNarrowEmphasizedIfEqual = (emphasizedValue?: number) =>
  renderNarrowCell((value) => value === emphasizedValue)

const columnHelper = createSummaryColumnHelper<TierExerciseCompletionRow>()

const TierExerciseCompletions = ({
  data,
  highestTier,
  points,
}: TierExerciseCompletionProps) => {
  const { locale } = useRouter()
  const t = useTranslator(ProfileTranslations)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const columns = useMemo(() => {
    if (!isNarrow) {
      return columnHelper.columns([
        columnHelper.accessor("timestamp", {
          header: t("submissionDate"),
          size: 40,
        }),
        columnHelper.accessor("tier", {
          header: t("tier"),
          size: 20,
          cell: renderEmphasizedIfEqual(highestTier),
        }),
        columnHelper.accessor("n_points", {
          header: t("points"),
          size: 20,
          cell: renderEmphasizedIfEqual(points),
        }),
        columnHelper.accessor("completed", {
          header: t("completed"),
          size: 20,
          meta: { headerTooltip: t("completedTooltip") },
          cell: renderCheck({ success: t("completed") }),
        }),
        columnHelper.accessor("exercise_completion_required_actions", {
          header: t("requiredActions"),
          size: 100,
          meta: { headerTooltip: t("requiredActionsTooltip") },
          cell: renderRequiredActions,
        }),
      ])
    }

    return columnHelper.columns([
      columnHelper.accessor("timestamp", {
        header: t("submissionDate"),
        cell: renderNarrowValue,
      }),
      columnHelper.accessor("tier", {
        header: t("tier"),
        cell: renderNarrowEmphasizedIfEqual(highestTier),
      }),
      columnHelper.accessor("n_points", {
        header: t("points"),
        cell: renderNarrowEmphasizedIfEqual(points),
      }),
      columnHelper.accessor("completed", {
        header: t("completed"),
        cell: renderNarrowCheck({
          success: t("completed"),
          failure: t("notCompleted"),
        }),
      }),
      columnHelper.accessor("exercise_completion_required_actions", {
        header: t("requiredActions"),
        cell: renderNarrowRequiredActions,
      }),
    ])
  }, [t, isNarrow, highestTier, points])

  const rows = useMemo(() => data.map(mapDataToRow(locale)), [locale, data])

  return (
    <SummaryTable
      data={rows}
      columns={columns}
      title={
        isNarrow ? undefined : (
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {t("submissions")}
          </Typography>
        )
      }
    />
  )
}

export default TierExerciseCompletions
