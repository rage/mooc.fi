import { max, min } from "lodash"

import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import { CardContent, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserTierCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

type RelevantDatesProps = {
  data:
    | UserCourseSummaryCoreFieldsFragment
    | UserTierCourseSummaryCoreFieldsFragment
}

const RelevantDatesCardContent = styled(CardContent)`
  display: grid;
  justify-content: space-between;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
  width: 100%;
`

const TooltipWrapper = styled("div")`
  margin-left: auto;
  padding-right: 1rem;
`

const RelevantDatesCard = styled(SummaryCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const hasCompletion = (
  data: RelevantDatesProps["data"],
): data is UserCourseSummaryCoreFieldsFragment => "completion" in data
const hasTierSummaries = (
  data: RelevantDatesProps["data"],
): data is UserCourseSummaryCoreFieldsFragment =>
  ((data as any).tier_summaries?.length ?? 0) > 0

function RelevantDates({ data }: RelevantDatesProps) {
  const t = useTranslator(ProfileTranslations)
  const isTieredCourse = hasTierSummaries(data)
  const isRootCourse = hasCompletion(data)
  const hasTier = (data?.course?.tier ?? 0) > 0
  const startDate = data?.start_date
  const exerciseCompletions = isTieredCourse
    ? data?.tier_summaries
        ?.flatMap((ts) => ts.exercise_completions)
        .filter(notEmpty)
    : data?.exercise_completions?.filter(notEmpty)
  const firstExerciseDate = min(
    exerciseCompletions?.map((ec) => ec.created_at).filter(notEmpty),
  )
  const latestExerciseDate = max(
    exerciseCompletions?.map((ec) => ec.created_at).filter(notEmpty),
  )
  const completionDate = isRootCourse
    ? data?.completion?.completion_date
    : undefined

  return (
    <RelevantDatesCard>
      <RelevantDatesCardContent sx={{ width: "100%" }}>
        {(isRootCourse || isTieredCourse) && !hasTier && (
          <Typography variant="h4">
            {t("courseStartDate")}
            <strong>{formatDateTime(startDate)}</strong>
          </Typography>
        )}
        <Typography variant="h4">
          {t("firstExerciseDate")}
          <strong>{formatDateTime(firstExerciseDate)}</strong>
        </Typography>
        <Typography variant="h4">
          {t("latestExerciseDate")}
          <strong>{formatDateTime(latestExerciseDate)}</strong>
        </Typography>
        {isRootCourse && (
          <Typography variant="h4">
            {t("completedDate")}
            <strong>{formatDateTime(completionDate)}</strong>
          </Typography>
        )}
      </RelevantDatesCardContent>
      <TooltipWrapper>
        <Tooltip title={t("relevantDatesTooltip")}>
          <HelpIcon />
        </Tooltip>
      </TooltipWrapper>
    </RelevantDatesCard>
  )
}

export default RelevantDates
