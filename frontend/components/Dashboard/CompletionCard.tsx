import CloseIcon from "@mui/icons-material/Close"
import DoneIcon from "@mui/icons-material/Done"
import {
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { formatDateTime } from "/util/dataFormatFunctions"

import { CompletionsQueryNodeFieldsFragment } from "/graphql/generated"

const LanguageNameKeys = {
  en_US: "languageEnglish",
  fi_FI: "languageFinnish",
  sv_SE: "languageSwedish",
} as const

const StyledIcon = styled(Icon)`
  margin-top: 1rem;
`

const ListItemArea = styled("div")`
  margin: 1rem auto 1rem auto;
`

const CompletionInfoText = styled(Typography)`
  display: block;
` as typeof Typography

interface CompletionCardProps {
  completer: CompletionsQueryNodeFieldsFragment
}

function CompletionCard({ completer }: CompletionCardProps) {
  const t = useTranslator(CoursesTranslations)
  const languageKey =
    LanguageNameKeys[
      (completer?.completion_language ?? "") as keyof typeof LanguageNameKeys
    ]
  const completionLanguage = languageKey
    ? t(languageKey)
    : t("noLanguageAvailable")
  const completionsRegistered = completer?.completions_registered ?? []
  const studentId = completer?.user?.student_number
    ? `HY SID: ${completer.user.student_number}`
    : t("noStudentNumber")
  const completionDate = completionsRegistered.length
    ? `${t("completionRegistered")}: ${formatDateTime(completer.created_at)}`
    : t("completionNotRegistered")

  return (
    <ListItemArea>
      <ListItem alignItems="flex-start">
        <ListItemIcon>
          {completionsRegistered.length > 0 ? (
            <StyledIcon>
              <DoneIcon />
            </StyledIcon>
          ) : (
            <StyledIcon>
              <CloseIcon />
            </StyledIcon>
          )}
        </ListItemIcon>
        <ListItemText
          primary={`${completer.user?.first_name} ${completer.user?.last_name}`}
          secondary={
            <>
              <CompletionInfoText component="span">
                {completer.email} {studentId}
              </CompletionInfoText>
              <CompletionInfoText component="span">
                {t("completionLanguageLabel")}: {completionLanguage}
              </CompletionInfoText>
              <CompletionInfoText component="span">
                {completionDate}
              </CompletionInfoText>
            </>
          }
        />
      </ListItem>
      <Divider component="li" />
    </ListItemArea>
  )
}

export default CompletionCard
