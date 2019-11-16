import React from "react"
import { AllCompletions_completionsPaginated_edges_node } from "/static/types/generated/AllCompletions"
import {
  ListItem,
  ListItemText,
  Divider,
  Typography,
  ListItemIcon,
  Icon,
} from "@material-ui/core"
import DoneIcon from "@material-ui/icons/Done"
import CloseIcon from "@material-ui/icons/Close"
import styled from "styled-components"

//map language code stored to database to human readable language
const MapLangToLanguage: Record<string, string> = {
  en_US: "English",
  fi_FI: "Finnish",
  sv_SE: "Swedish",
}

//format registration time stored to db to human readable text
function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

const StyledIcon = styled(Icon)`
  margin-top: 1rem;
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
    ? formatDateTime(completer.created_at)
    : ""

  return (
    <>
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
          primary={`${completer.user.first_name} ${completer.user.last_name}`}
          secondary={
            <React.Fragment>
              <Typography component="span" style={{ display: "block" }}>
                {completer.email} {studentId}
              </Typography>
              {completionLanguage}
              {completionDate}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider component="li" />
    </>
  )
}

export default CompletionCard
