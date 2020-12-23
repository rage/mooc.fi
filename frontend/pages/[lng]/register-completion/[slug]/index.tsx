import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { RegisterCompletionUserOverView as UserOverViewData } from "/static/types/generated/RegisterCompletionUserOverView"
import { Typography, Paper, SvgIcon } from "@material-ui/core"
import RegisterCompletionText from "/components/RegisterCompletionText"
import ImportantNotice from "/components/ImportantNotice"
import Container from "/components/Container"
import RegisterCompletionTranslations from "/translations/register-completion"
import { useContext } from "react"
import { H1NoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import styled from "styled-components"
import withSignedIn from "/lib/with-signed-in"
import LoginStateContext from "/contexes/LoginStateContext"
import { CheckSlugQuery } from "/graphql/queries/courses"
import { useTranslator } from "/translations"

const StyledPaper = styled(Paper)`
  padding: 1em;
  margin: 1em;
`
const StyledPaperRow = styled(Paper)`
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledPaperColumn = styled(Paper)`
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledIcon = styled(SvgIcon)`
  width: 30px;
  height: 30px;
  margin: 0.5em;
`
const StyledText = styled(Typography)<any>`
  margin-top: 0px;
  margin-left: 1em;
`

export const UserOverViewQuery = gql`
  query RegisterCompletionUserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      completions {
        id
        email
        completion_language
        completion_link
        student_number
        created_at
        course {
          id
          slug
          name
          ects
        }
        completions_registered {
          id
          completion_id
          organization {
            slug
          }
        }
        eligible_for_ects
      }
    }
  }
`

const RegisterCompletion = () => {
  const { currentUser } = useContext(LoginStateContext)

  const courseSlug = useQueryParameter("slug")

  const t = useTranslator(RegisterCompletionTranslations)
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(CheckSlugQuery, {
    variables: {
      slug: courseSlug,
    },
  })
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery<UserOverViewData>(UserOverViewQuery)

  if (courseLoading || userLoading) {
    return <Spinner />
  }

  if (userError || courseError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(userError || courseError, undefined, 2)}
      />
    )
  }

  const completion =
    userData?.currentUser?.completions?.find(
      (c) => c.course?.slug == courseSlug,
    ) ?? undefined

  if (!currentUser) {
    return <div>You are not logged in. Please log in to the site</div>
  }

  if (!(courseData?.course_exists ?? false)) {
    return (
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("course_not_found_title")}
        </H1NoBackground>
        <Typography>{t("course_not_found", { course: courseSlug })}</Typography>
      </Container>
    )
  }

  const registeredCompletion =
    completion?.completions_registered?.find(
      (c) => c?.completion_id === completion?.id,
    ) ?? undefined

  if (!completion?.eligible_for_ects) {
    return (
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("course_completion_not_found_title")}
        </H1NoBackground>
        <Typography>{t("course_completion_not_found")}</Typography>
      </Container>
    )
  }

  if (registeredCompletion) {
    return (
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("course_completion_already_registered_title")}
        </H1NoBackground>
        <Typography>{t("course_completion_already_registered")}</Typography>
        <StyledPaperColumn>
          <Typography variant="body1">
            {t("see_completion_link")}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://opintopolku.fi/oma-opintopolku/"
            >
              {" "}
              opintopolku.fi/oma-opintopolku/
            </a>
          </Typography>
          <Typography variant="body1">{t("see_completion_NB")}</Typography>
        </StyledPaperColumn>
      </Container>
    )
  }

  //map completions language to a link
  //if completion has a language field defined
  const courseLinkWithLanguage = completion?.completion_link

  if (!courseLinkWithLanguage) {
    return (
      <div>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("title")}
        </H1NoBackground>
        <StyledPaper>
          <Typography variant="body1" paragraph>
            {t("open_university_registration_not_open")}{" "}
            {completion.course?.name} {completion.completion_language}.
          </Typography>
        </StyledPaper>
      </div>
    )
  }

  return (
    <>
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("title")}
        </H1NoBackground>
        <StyledText>
          {t("course", { course: completion.course?.name })}
        </StyledText>
        {completion.course?.ects && (
          <StyledText variant="h6" component="p" gutterBottom={true}>
            {t("credits", { ects: completion.course?.ects })}
          </StyledText>
        )}
        <StyledPaper>
          <Typography variant="body1" paragraph>
            {t("credits_details")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("donow")}
          </Typography>
        </StyledPaper>
        <ImportantNotice email={completion.email} />
        <RegisterCompletionText
          email={completion.email}
          link={courseLinkWithLanguage}
        />
        <StyledPaperColumn>
          <Typography variant="body1">
            {t("see_completion_link")}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://opintopolku.fi/oma-opintopolku/"
            >
              {" "}
              opintopolku.fi/oma-opintopolku/
            </a>
          </Typography>
          <Typography variant="body1">{t("see_completion_NB")}</Typography>
        </StyledPaperColumn>
        <StyledPaperRow>
          <StyledIcon color="primary">
            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </StyledIcon>
          <Typography variant="body1">{t("NB")}</Typography>
        </StyledPaperRow>
      </Container>
    </>
  )
}

RegisterCompletion.displayName = "RegisterCompletion"

export default withSignedIn(RegisterCompletion)
