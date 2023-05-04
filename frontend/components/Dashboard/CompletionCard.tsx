import CloseIcon from "@mui/icons-material/Close"
import DoneIcon from "@mui/icons-material/Done"
import {
  BoxProps,
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TypographyProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { formatDateTime } from "/util/dataFormatFunctions"

import { CompletionsQueryNodeFieldsFragment } from "/graphql/generated"

//map language code stored to database to human readable language
const MapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Finnish",
  sv_SE: "Swedish",
}

const StyledIcon = styled(Icon)`
  margin-top: 1rem;
`

const ListItemArea = styled("div")`
  margin: 1rem auto 1rem auto;
`

const CompletionInfoText = styled(Typography)<TypographyProps & BoxProps>`
  display: block;
`

CompletionInfoText.defaultProps = {
  component: "span",
}

interface CompletionCardProps {
  completer: CompletionsQueryNodeFieldsFragment
}

function CompletionCard({ completer }: CompletionCardProps) {
  const completionLanguage =
    MapLangToLanguage[completer?.completion_language ?? ""] ??
    "No language available"
  const completionsRegistered = completer?.completions_registered ?? []
  const studentId = completer?.user?.student_number
    ? `HY SID: ${completer.user.student_number}`
    : "No student number"
  const completionDate = completionsRegistered.length
    ? `Completion registered: ${formatDateTime(completer.created_at)}`
    : "Completion has not been registered"

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
              <CompletionInfoText>
                {completer.email} {studentId}
              </CompletionInfoText>
              <CompletionInfoText>
                Completion language: {completionLanguage}
              </CompletionInfoText>
              <CompletionInfoText>{completionDate}</CompletionInfoText>
            </>
          }
        />
      </ListItem>
      <Divider component="li" />
    </ListItemArea>
  )
}

export default CompletionCard
