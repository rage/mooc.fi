import React, { useContext } from "react"
import styled from "styled-components"
import { ProfileUserOverView_currentUser_completions as CompletionsData } from "/static/types/generated/ProfileUserOverView"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import {
  formatDateTime,
  MapLangToLanguage,
} from "/components/DataFormatFunctions"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"

const StyledButton = styled(Button)`
  height: 50%;
  margin-top: auto;
  margin-bottom: auto;
  color: black;
`
const RegisterCompletionButton = ({ course }: { course: string }) => {
  return (
    <StyledButton color="secondary" href={`/register-completion/${course}`}>
      Register Completion
    </StyledButton>
  )
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
  const isRegistered =
    listItem.completions_registered &&
    listItem.completions_registered.length > 0
  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)
  return (
    <ListItemContainer>
      <p>Picture</p>
      <ListItemText component="p" variant="h3">
        {listItem.course.name}
      </ListItemText>
      <div>
        <ListItemText>{`${t("completedDate")}${formatDateTime(
          listItem.created_at,
        )}`}</ListItemText>
        <ListItemText>{`${t("completionLanguage")} ${
          listItem.completion_language
            ? MapLangToLanguage.get(listItem.completion_language)
            : listItem.completion_language
        }`}</ListItemText>
      </div>
      {isRegistered ? (
        <p>RegistrationDetails</p>
      ) : (
        <RegisterCompletionButton course={listItem.course.slug} />
      )}
    </ListItemContainer>
  )
}

export default CompletionListItem
