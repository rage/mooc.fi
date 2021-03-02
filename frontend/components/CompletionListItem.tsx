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
import { CompletionsRegisteredFragment_completions_registered } from "/static/types/generated/CompletionsRegisteredFragment"

const StyledButton = styled(Button)`
  height: 50%;
  color: black;
`

const StyledA = styled.a`
  margin: auto;
`

interface CourseAvatarProps {
  course:
    | CourseStatistics_user_course_statistics_course
    | ProfileUserOverView_currentUser_completions_course
}
const CourseAvatar = ({ course }: CourseAvatarProps) => {
  return (
    <Avatar
      style={{ margin: "10px", width: 60, height: 60, gridArea: "avatar" }}
      src={course?.photo ? addDomain(course.photo.uncompressed) : undefined}
    >
      {!course?.photo ? "M" : undefined}
    </Avatar>
  )
}

const ListItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;
  padding: 0.5rem;
`
const CompletionInfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const CompletionInfo = styled.li``

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
      <CourseAvatar course={course} />
      <CardTitle
        component="h2"
        variant="h3"
        style={{ width: "50%", paddingRight: "0.5rem", gridArea: "name" }}
      >
        {course?.name}
      </CardTitle>
      <CardSubtitle component="div" style={{ margin: "auto", width: "30%" }}>
        <CompletionInfoList>
          <CompletionInfo>
            {`${t("completedDate")}${formatDateTime(completion.created_at)}`}
          </CompletionInfo>
          {completion.completion_language ? (
            <CompletionInfo>
              {`${t("completionLanguage")} ${
                mapLangToLanguage[completion?.completion_language ?? ""] ||
                completion.completion_language
              }`}
            </CompletionInfo>
          ) : null}
          {completion.tier !== null && completion.tier !== undefined ? (
            <CompletionInfo>
              {`${t("completionTier")} ${t(
                // @ts-ignore: tier
                `completionTier-${completion.tier}`,
              )}`}
            </CompletionInfo>
          ) : null}
        </CompletionInfoList>
      </CardSubtitle>
      {isRegistered && completion.completions_registered ? (
        (completion.completions_registered as CompletionsRegisteredFragment_completions_registered[])?.map(
          (r) => {
            return (
              <div
                style={{ minWidth: "115px", margin: "auto" }}
                key={`completion-registered-${r.id}`}
              >
                <CardSubtitle>
                  {t("registeredDate")}
                  {formatDateTime(r.created_at)}
                </CardSubtitle>
                {r.organization ? (
                  <CardSubtitle>
                    {t("organization")}
                    {r.organization.slug}
                  </CardSubtitle>
                ) : null}
                <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
              </div>
            )
          },
        )
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
        <CardSubtitle style={{ width: "115px" }}>&nbsp;</CardSubtitle>
      )}
      {hasCertificate && course ? (
        <CardSubtitle>
          <CertificateButton course={course} />
        </CardSubtitle>
      ) : null}
    </ListItemContainer>
  )
}

export default CompletionListItem
