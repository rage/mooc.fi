import React, { useContext } from "react"
import styled from "styled-components"
import { ProfileUserOverView_currentUser_completions as CompletionsData } from "/static/types/generated/ProfileUserOverView"
//import {ProfileUserOverView_currentUser_completions_completions_registered as Registered } from "/static/types/generated/ProfileUserOverView"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import {
  formatDateTime,
  mapLangToLanguage,
} from "/components/DataFormatFunctions"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import DoneIcon from "@material-ui/icons/Done"
import Avatar from "@material-ui/core/Avatar"

const StyledButton = styled(Button)`
  height: 50%;
  margin: auto;
  color: black;
`

const RegisterCompletionButton = ({ course }: { course: string }) => {
  return (
    <StyledButton color="secondary" href={`/register-completion/${course}`}>
      Register Completion
    </StyledButton>
  )
}

const CourseAvatar = ({ photo }: { photo: any }) => {
  if (photo) {
    return (
      <Avatar
        style={{ margin: "auto", width: 60, height: 60 }}
        src={photo.uncompressed}
      />
    )
  }
  return <Avatar style={{ margin: "auto", width: 60, height: 60 }}>M</Avatar>
}
const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  margin-bottom: 1rem;
`
const ListItemText = styled(Typography)`
  padding: 0.5rem;
`
interface ListItemProps {
  listItem: CompletionsData
}
const CompletionListItem = (props: ListItemProps) => {
  const { listItem } = props
  const isRegistered = (listItem?.completions_registered ?? []).length > 0

  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)

  return (
    <ListItemContainer>
      <CourseAvatar photo={listItem.course.photo} />
      <ListItemText component="p" variant="h3" style={{ margin: "auto" }}>
        {listItem.course.name}
      </ListItemText>
      <div style={{ margin: "auto" }}>
        <ListItemText>{`${t("completedDate")}${formatDateTime(
          listItem.created_at,
        )}`}</ListItemText>
        <ListItemText>{`${t("completionLanguage")} ${mapLangToLanguage[
          listItem?.completion_language ?? ""
        ] || listItem.completion_language}`}</ListItemText>
      </div>
      {isRegistered && listItem.completions_registered ? (
        listItem.completions_registered.map(r => {
          ;<div style={{ margin: "auto" }}>
            <ListItemText>
              {t("registeredDate")}
              {formatDateTime(r.created_at)}
            </ListItemText>
            <ListItemText>{r.organization?.slug ?? ""}</ListItemText>
            <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
          </div>
        })
      ) : (
        <RegisterCompletionButton course={listItem.course.slug} />
      )}
    </ListItemContainer>
  )
}

export default CompletionListItem
