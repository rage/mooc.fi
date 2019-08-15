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
import { AllCompletions_completionsPaginated_edges_node_completions_registered as completionsRegistered } from "/static/types/generated/AllCompletions"
import DoneIcon from "@material-ui/icons/Done"
import CloseIcon from "@material-ui/icons/Close"
import styled from "styled-components"

//map language code stored to database to human readable language
const MapLangToLanguage = new Map(
  Object.entries({
    en_US: "English",
    fi_FI: "Finnish",
    sv_SE: "Swedish",
  }),
)

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
  let completionLanguage: string | undefined = "No language available"
  if (completer.completion_language) {
    completionLanguage = MapLangToLanguage.get(completer.completion_language)
  }

  let completionsregistered: completionsRegistered[] = []
  if (completer.completions_registered) {
    completionsregistered = completer.completions_registered
  }

  let studentId: string = "No student number"
  if (completer.user.student_number) {
    studentId = `HY SID: ${completer.user.student_number}`
  }

  let completionDate = ""
  if (completionsregistered.length > 0) {
    completionDate = formatDateTime(completer.created_at)
  }

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemIcon>
          {completionsregistered.length > 0 ? (
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
