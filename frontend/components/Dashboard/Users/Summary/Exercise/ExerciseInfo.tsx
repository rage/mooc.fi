import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import { Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ExerciseRow } from "./common"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { useFormatDateTime } from "/util/dataFormatFunctions"

interface ExerciseInfoProps {
  exercise: ExerciseRow
}

const ExerciseInfoContent = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  gap: 2rem;
`

const ExerciseInfo = ({ exercise }: ExerciseInfoProps) => {
  const t = useTranslator(ProfileTranslations)
  const formatDateTime = useFormatDateTime()

  if (!exercise?.exercise_completions?.length) {
    return null
  }

  const exerciseCompletion = exercise.exercise_completions[0]

  return (
    <ExerciseInfoContent>
      <Typography variant="h4">
        {t("createdAt")}{" "}
        <strong>
          {formatDateTime(exerciseCompletion.created_at, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </strong>
      </Typography>
      <Typography variant="h4">
        {t("timestamp")}{" "}
        <strong>
          {formatDateTime(exerciseCompletion.timestamp, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </strong>
      </Typography>
      <Tooltip title={t("exerciseInfoTooltip")}>
        <HelpIcon />
      </Tooltip>
    </ExerciseInfoContent>
  )
}

export default ExerciseInfo
