import {
  formatDateTime,
  mapLangToLanguage,
} from "/components/DataFormatFunctions"
import { CompletionsRegisteredFragment_completions_registered } from "/static/types/generated/CompletionsRegisteredFragment"
import {
  ProfileUserOverView_currentUser_completions,
  ProfileUserOverView_currentUser_completions_course,
} from "/static/types/generated/ProfileUserOverView"
import {
  UserSummary_user_user_course_summary_completion,
  UserSummary_user_user_course_summary_course,
} from "/static/types/generated/UserSummary"
import ProfileTranslations from "/translations/profile"
import { addDomain } from "/util/imageUtils"
import { useTranslator } from "/util/useTranslator"
import styled from "@emotion/styled"
import DoneIcon from "@mui/icons-material/Done"
import { Avatar, Button, Paper } from "@mui/material"
import CertificateButton from "components/CertificateButton"
import { CardSubtitle, CardTitle } from "components/Text/headers"
import Link from "next/link"

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

const ListItemContainer = styled(Paper)`
  background-color: white;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;
  padding: 0.5rem;
`

const Row = styled.section`
  display: flex;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 860px) {
    flex-wrap: wrap;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`
const CompletionColumn = styled(Column)``
const RegistrationColumn = styled(Column)`
  width: 40%;
`
const ButtonColumn = styled(Column)`
  margin-top: 1rem;
  margin-right: 1.5rem;
  gap: 0.5rem;
  @media (max-width: 860px) {
    flex-direction: row;
    justify-content: flex-end;
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
        <CompletionColumn>
          <Row>
            <Column>
              <CourseAvatar course={course} />
            </Column>
            <Column>
              <CardSubtitle>
                <strong>{`${t("completedDate")}${formatDateTime(
                  completion.completion_date,
                )}`}</strong>
                {completion.completion_language ? (
                  <CardSubtitle>
                    {`${t("completionLanguage")} ${
                      mapLangToLanguage[
                        completion?.completion_language ?? ""
                      ] || completion.completion_language
                    }`}
                  </CardSubtitle>
                ) : null}
                {completion.tier !== null && completion.tier !== undefined ? (
                  <CardSubtitle>
                    {`${t("completionTier")} ${t(
                      // @ts-ignore: tier
                      `completionTier-${completion.tier}`,
                    )}`}
                  </CardSubtitle>
                ) : null}
              </CardSubtitle>
            </Column>
          </Row>
          <Row>
            <CardTitle
              component="h2"
              variant="h3"
              style={{ paddingRight: "0.5rem", gridArea: "title" }}
            >
              {course?.name}
            </CardTitle>
          </Row>
        </CompletionColumn>

        <RegistrationColumn>
          {isRegistered && completion.completions_registered
            ? (
                completion.completions_registered as CompletionsRegisteredFragment_completions_registered[]
              )?.map((r) => {
                return (
                  <Row key={`registration-${r.id}`}>
                    <Column>
                      <CardSubtitle>
                        <strong>
                          {t("registeredDate")}
                          {formatDateTime(r.created_at)}
                        </strong>
                      </CardSubtitle>
                      {r.organization ? (
                        <CardSubtitle>
                          {t("organization")}
                          {r.organization.slug}
                        </CardSubtitle>
                      ) : null}
                    </Column>
                    <div
                      style={{
                        margin: "auto auto auto 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <DoneIcon style={{ color: "green" }} />
                    </div>
                  </Row>
                )
              })
            : null}
        </RegistrationColumn>
        <ButtonColumn>
          {!isRegistered && completion.eligible_for_ects ? (
            <Link href={`/register-completion/${course?.slug}`} passHref>
              <StyledA>
                <StyledButton color="secondary">
                  {t("registerCompletion")}
                </StyledButton>
              </StyledA>
            </Link>
          ) : null}
          {hasCertificate && course ? (
            <CertificateButton course={course} />
          ) : null}
        </ButtonColumn>
      </Row>
    </ListItemContainer>
  )
}
