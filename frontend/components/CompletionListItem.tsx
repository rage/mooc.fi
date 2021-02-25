import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"
import {
  formatDateTime,
  mapLangToLanguage,
} from "/components/DataFormatFunctions"
import ProfileTranslations from "/translations/profile"
import DoneIcon from "@material-ui/icons/Done"
import Avatar from "@material-ui/core/Avatar"
import { CardTitle, CardSubtitle } from "components/Text/headers"
import { addDomain } from "/util/imageUtils"
import Link from "next/link"
import CertificateButton from "components/CertificateButton"
import { useTranslator } from "/util/useTranslator"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import {
  CourseStatistics_user_course_statistics_completion,
  CourseStatistics_user_course_statistics_course,
} from "/static/types/generated/CourseStatistics"
import { ProfileUserOverView_currentUser_completions_course } from "/static/types/generated/ProfileUserOverView"

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
  completion:
    | CourseStatistics_user_course_statistics_completion
    | ProfileUserOverView_currentUser_completions
  course:
    | CourseStatistics_user_course_statistics_course
    | ProfileUserOverView_currentUser_completions_course
}

const CompletionListItem = ({ completion, course }: ListItemProps) => {
  const isRegistered = (completion?.completions_registered ?? []).length > 0
  const t = useTranslator(ProfileTranslations)

  const hasCertificate = course?.has_certificate

  return (
    <ListItemContainer>
      <CourseAvatar photo={course?.photo} />
      <CardTitle component="h2" variant="h3">
        {course?.name}
      </CardTitle>
      <div style={{ margin: "auto" }}>
        <CardSubtitle>{`${t("completedDate")}${formatDateTime(
          completion.created_at,
        )}`}</CardSubtitle>
        <CardSubtitle>
          {completion.completion_language
            ? `${t("completionLanguage")} ${
                mapLangToLanguage[completion?.completion_language ?? ""] ||
                completion.completion_language
              }`
            : null}
        </CardSubtitle>
        {completion.tier !== null && completion.tier !== undefined ? (
          <CardSubtitle>
            {t("completionTier")}
            {
              // @ts-ignore: tier thingy
              t(`completionTier-${listItem.tier}`)
            }
          </CardSubtitle>
        ) : null}
      </div>
      {isRegistered && completion.completions_registered ? (
        completion.completions_registered.map((r) => (
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
      ) : completion.eligible_for_ects ? (
        <Link
          href="/register-completion/[slug]"
          as={`/register-completion/${course?.slug}`}
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
      {hasCertificate && course ? <CertificateButton course={course} /> : null}
    </ListItemContainer>
  )
}

export default CompletionListItem
