import { min } from "lodash"

import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import { Card, CardContent, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { formatDateTime } from "/components/DataFormatFunctions"
import ProfileTranslations from "/translations/profile"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface RelevantDatesProps {
  data?: UserCourseSummaryCoreFieldsFragment
}

const RelevantDatesCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

RelevantDatesCard.defaultProps = {
  elevation: 4,
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
    data?.exercise_completions?.filter(notEmpty).map((ec) => ec.created_at),
  )
  const completionDate = data?.completion?.completion_date

  return (
    <RelevantDatesCard>
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
    </RelevantDatesCard>
  )
}
