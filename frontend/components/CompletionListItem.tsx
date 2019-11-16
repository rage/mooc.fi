import React, { useContext } from "react"
import styled from "styled-components"
import { ProfileUserOverView_currentUser_completions as CompletionsData } from "/static/types/generated/ProfileUserOverView"
import Button from "@material-ui/core/Button"
import {
  formatDateTime,
  mapLangToLanguage,
} from "/components/DataFormatFunctions"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import DoneIcon from "@material-ui/icons/Done"
import Avatar from "@material-ui/core/Avatar"
import { CardTitle, CardSubtitle } from "components/Text/headers"

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
      <CardTitle component="h2" variant="h3">
        {listItem.course.name}
      </CardTitle>
      <div style={{ margin: "auto" }}>
        <CardSubtitle>{`${t("completedDate")}${formatDateTime(
          listItem.created_at,
        )}`}</CardSubtitle>
        <CardSubtitle>{`${t("completionLanguage")} ${
          listItem.completion_language
            ? MapLangToLanguage.get(listItem.completion_language)
            : listItem.completion_language
        }`}</CardSubtitle>
      </div>
      {isRegistered && listItem.completions_registered ? (
        listItem.completions_registered.map(r => {
          ;<div style={{ margin: "auto" }}>
            <CardSubtitle>
              {t("registeredDate")}
              {formatDateTime(r.created_at)}
            </CardSubtitle>
            <CardSubtitle>
              {r.organization ? r.organization.slug : ""}
            </CardSubtitle>
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
