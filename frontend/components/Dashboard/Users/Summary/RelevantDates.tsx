import { min } from "lodash"

import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import { CardContent, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { SummaryCard } from "/components/Dashboard/Users/Summary/common"
import { formatDateTime } from "/components/DataFormatFunctions"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface RelevantDatesProps {
  data?: UserCourseSummaryCoreFieldsFragment
}

const RelevantDatesCardContent = styled(CardContent)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
`
export default function RelevantDates({ data }: RelevantDatesProps) {
  const t = useTranslator(ProfileTranslations)

  const startDate = data?.start_date
  const firstExerciseDate = min(
    data?.exercise_completions?.map((ec) => ec.created_at),
  )
  const completionDate = data?.completion?.completion_date

  return (
    <SummaryCard>
      <RelevantDatesCardContent>
        <Typography variant="h4">
          {t("courseStartDate")}
          <strong>{formatDateTime(startDate)}</strong>
        </Typography>
        <Typography variant="h4">
          {t("firstExerciseDate")}
          <strong>{formatDateTime(firstExerciseDate)}</strong>
        </Typography>
        <Typography variant="h4">
          {t("completedDate")}
          <strong>{formatDateTime(completionDate)}</strong>
        </Typography>
        <Tooltip title={t("relevantDatesTooltip")}>
          <HelpIcon />
        </Tooltip>
      </RelevantDatesCardContent>
    </SummaryCard>
  )
}
