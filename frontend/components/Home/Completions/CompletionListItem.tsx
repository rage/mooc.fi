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
import LangLink from "/components/LangLink"
import CertificateButton from "components/CertificateButton"
import { useTranslator } from "/util/useTranslator"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import {
  UserSummary_user_user_course_summary_completion,
  UserSummary_user_user_course_summary_course,
} from "/static/types/generated/UserSummary"
import { ProfileUserOverView_currentUser_completions_course } from "/static/types/generated/ProfileUserOverView"
import { CompletionsRegisteredFragment_completions_registered } from "/static/types/generated/CompletionsRegisteredFragment"

const StyledButton = styled(Button)`
  //height: 50%;
  color: black;
`

const StyledA = styled.a`
  margin: auto;
`

interface CourseAvatarProps {
  course:
    | UserSummary_user_user_course_summary_course
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

const BaseList = `
  list-style: none;
  margin: 0;
  padding: 0;
`
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
  ${BaseList}
`
const CompletionInfo = styled.li``
const RegistrationList = styled.ul`
  ${BaseList}
  grid-area: "registration";
  display: flex;
  flex-direction: row;
`
const Registration = styled.li`
  min-width: 115px;
  margin: auto;
`
const ButtonList = styled.ul`
  ${BaseList}
  grid-area: "buttons";
  display: flex;
  align-items: center;
  flex-direction: row;
  @media (min-width: 640px) and (max-width: 900px) {
    flex-direction: column;
  }
  justify-content: space-between;
  gap: 0.5rem;
`
const ButtonWrapper = styled.li``

const Row = styled.section`
  display: grid;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  @media (max-width: 500px) {
    width: 100%;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "avatar title"
      "completion registration"
      "empty buttons";
  }
  @media (min-width: 500px) and (max-width: 640px) {
    width: 100%;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "avatar title"
      "completion registration"
      "empty buttons";
  }
  @media (min-width: 640px) and (max-width: 800px) {
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-areas:
      "avatar title completion"
      "empty registration buttons";
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(5, 1fr);
    grid-template-areas: "avatar title completion registration buttons";
  }
`
interface ListItemProps {
  completion:
    | UserSummary_user_user_course_summary_completion
    | ProfileUserOverView_currentUser_completions
  course:
    | UserSummary_user_user_course_summary_course
    | ProfileUserOverView_currentUser_completions_course
}

export const CompletionListItem = ({ completion, course }: ListItemProps) => {
  const isRegistered = (completion?.completions_registered ?? []).length > 0
  const t = useTranslator(ProfileTranslations)

  const hasCertificate = course?.has_certificate

  return (
    <ListItemContainer>
      <Row>
        <CourseAvatar course={course} />
        <CardTitle
          component="h2"
          variant="h3"
          style={{ paddingRight: "0.5rem", gridArea: "title" }}
        >
          {course?.name}
        </CardTitle>
        <CardSubtitle
          component="div"
          style={{ margin: "auto", gridArea: "completion" }}
        >
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
        <div style={{ gridArea: "empty" }}></div>
        <RegistrationList>
          {isRegistered && completion.completions_registered
            ? (completion.completions_registered as CompletionsRegisteredFragment_completions_registered[])?.map(
                (r) => {
                  return (
                    <Registration key={`completion-registered-${r.id}`}>
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
                      <DoneIcon
                        style={{ color: "green", marginTop: "0.5rem" }}
                      />
                    </Registration>
                  )
                },
              )
            : null}
        </RegistrationList>
        <ButtonList>
          {!isRegistered && completion.eligible_for_ects ? (
            <ButtonWrapper>
              <LangLink href={`/register-completion/${course?.slug}`}>
                <StyledA>
                  <StyledButton color="secondary">
                    {t("registerCompletion")}
                  </StyledButton>
                </StyledA>
              </LangLink>
            </ButtonWrapper>
          ) : (
            <CardSubtitle style={{ width: "115px" }}>&nbsp;</CardSubtitle>
          )}

          {hasCertificate && course ? (
            <ButtonWrapper>
              <CertificateButton course={course} />
            </ButtonWrapper>
          ) : null}
        </ButtonList>
      </Row>
    </ListItemContainer>
  )
}
