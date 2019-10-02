import React from "react"
import styled from "styled-components"
import { ProfileUserOverView_currentUser_completions as CompletionsData } from "/static/types/generated/ProfileUserOverView"
import Typography from "@material-ui/core/Typography"
//map language code stored to database to human readable language
const MapLangToLanguage = new Map(
  Object.entries({
    en_US: "English",
    fi_FI: "Suomi",
    sv_SE: "Swedish",
  }),
)

//format registration time stored to db to human readable text
function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const day = dateToFormat.getDate()
  const month = dateToFormat.getMonth()
  const year = dateToFormat.getFullYear()
  const formattedDate = `${day}\\${month}\\${year}`
  return formattedDate
}

const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
`
const ListItemText = styled(Typography)`
  padding: 0.5rem;
`
interface ListItemProps {
  listItem: CompletionsData
}
const CompletionListItem = (props: ListItemProps) => {
  const { listItem } = props
  const isRegistered = listItem.completions_registered
  console.log(listItem)
  return (
    <ListItemContainer>
      <p>Picture</p>
      <ListItemText component="p" variant="h3">
        {listItem.course.name}
      </ListItemText>
      <div>
        <ListItemText>{`Suoritettu:${formatDateTime(
          listItem.created_at,
        )}`}</ListItemText>
        <ListItemText>{`Suorituskieli: ${
          listItem.completion_language
            ? MapLangToLanguage.get(listItem.completion_language)
            : listItem.completion_language
        }`}</ListItemText>
      </div>
      {isRegistered ? <p>RegistrationDetails</p> : <p>Pls register</p>}
    </ListItemContainer>
  )
}

export default CompletionListItem
