import { Fragment } from "react"

import { formatDateTime } from "/components/DataFormatFunctions"
import { AllCompletions_completionsPaginated_edges_node } from "/static/types/generated/AllCompletions"

import styled from "@emotion/styled"
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

//map language code stored to database to human readable language
const MapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Finnish",
  sv_SE: "Swedish",
}

const StyledIcon = styled(Icon)`
  margin-top: 1rem;
`

const ListItemArea = styled.div`
  margin: 1rem auto 1rem auto;
`

function CompletionCard({
  completer,
}: {
  completer: AllCompletions_completionsPaginated_edges_node
}) {
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
            <Fragment>
              <Typography component="span" style={{ display: "block" }}>
                {completer.email} {studentId}
              </Typography>
              <Typography component="span" style={{ display: "block" }}>
                Completion language: {completionLanguage}
              </Typography>
              <Typography component="span" style={{ display: "block" }}>
                {completionDate}
              </Typography>
            </Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
    </ListItemArea>
  )
}

export default CompletionCard
