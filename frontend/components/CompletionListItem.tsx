import { useContext } from "react"
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
import { addDomain } from "/util/imageUtils"
import Link from "next/link"
import CertificateButton from "components/CertificateButton"

const StyledButton = styled(Button)`
  height: 50%;

  color: black;
`

const StyledA = styled.a`
  margin: auto;
`

const CourseAvatar = ({ photo }: { photo: any }) => {
  if (photo) {
    return (
      <Avatar
        style={{ margin: "auto", width: 60, height: 60 }}
        src={addDomain(photo.uncompressed)}
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
  //Checks from the course whether it has a certificate or not

  const hasCertificate = listItem?.course?.has_certificate

  return (
    <ListItemContainer>
      <CourseAvatar photo={listItem?.course?.photo} />
      <CardTitle component="h2" variant="h3">
        {listItem?.course?.name}
      </CardTitle>
      <div style={{ margin: "auto" }}>
        <CardSubtitle>{`${t("completedDate")}${formatDateTime(
          listItem.created_at,
        )}`}</CardSubtitle>
        <CardSubtitle>
          {listItem.completion_language
            ? `${t("completionLanguage")} ${
                mapLangToLanguage[listItem?.completion_language ?? ""] ||
                listItem.completion_language
              }`
            : null}
        </CardSubtitle>
        {listItem.tier !== null && listItem.tier !== undefined ? (
          <CardSubtitle>
            {t("completionTier")}
            {
              // @ts-ignore: tier thingy
              t(`completionTier-${listItem.tier}`)
            }
          </CardSubtitle>
        ) : null}
      </div>
      {isRegistered && listItem.completions_registered ? (
        listItem.completions_registered.map((r) => (
          <div style={{ margin: "auto" }} key={`completion-registered-${r.id}`}>
            <CardSubtitle>
              {t("registeredDate")}
              {formatDateTime(r.created_at)}
            </CardSubtitle>
            <CardSubtitle>
              {r.organization ? r.organization.slug : ""}
            </CardSubtitle>
            <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
          </div>
        ))
      ) : listItem.eligible_for_ects ? (
        <Link
          href="/register-completion/[slug]"
          as={`/register-completion/${listItem.course?.slug}`}
        >
          <StyledA>
            <StyledButton color="secondary">
              {t("registerCompletion")}
            </StyledButton>
          </StyledA>
        </Link>
      ) : (
        <div style={{ margin: "auto" }}>&nbsp;</div>
      )}
      {hasCertificate && listItem?.course ? (
        <CertificateButton course={listItem.course} />
      ) : null}
    </ListItemContainer>
  )
}

export default CompletionListItem
