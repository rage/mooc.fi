import React from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import DoneIcon from "@material-ui/icons/Done"
import NextI18Next from "../i18n"

const Background = styled(Paper)`
  background-color: white;

  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
  height: 100%;
  width: 100%;
`

const CourseTitle = styled(Typography)`
  margin: 0.5rem;
  padding-left: 1rem;
`
const CardText = styled(Typography)`
  margin: 0.5rem;
  padding-top: 0.2rem;
`
const RegistrationDetails = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
`

type Organization = {
  slug: string
}
type Registration = {
  id: any
  created_at: any
  organization: Organization
}
type Course = {
  id: any
  slug: string
  name: string
}
type Completion = {
  id: any
  completion_language: string
  student_number: string
  created_at: any
  course: Course
  completions_registered: Registration[]
}
interface CourseCardProps {
  completion: Completion
}

const MapLangToLanguage = new Map(
  Object.entries({
    en_US: "English",
    fi_FI: "Suomi",
    sv_SE: "Swedish",
  }),
)

function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

function CompletedCourseCard(props: CourseCardProps) {
  const { completion } = props
  const isRegistered = completion.completions_registered.length > 0
  const { i18n, t, ready } = NextI18Next.useTranslation("profile")
  const humanReadableLanguage =
    MapLangToLanguage.get(completion.completion_language) ||
    completion.completion_language
  const RegisterButtonVisible = completion.course.slug === "elements-of-ai"

  return (
    <Grid item xs={12}>
      <Background>
        <CourseTitle component="h3" variant="h6" gutterBottom={true}>
          {completion.course.name}
        </CourseTitle>
        <CardText>
          {t("completedDate")} {formatDateTime(completion.created_at)}
        </CardText>
        <CardText>
          {t("completionLanguage")}
          {humanReadableLanguage}
        </CardText>
        {isRegistered ? (
          completion.completions_registered.map(r => (
            <RegistrationDetails>
              <CardText>
                {t("registeredDate")} {formatDateTime(r.created_at)}
              </CardText>
              <CardText>{r.organization}</CardText>

              <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
            </RegistrationDetails>
          ))
        ) : (
          <Button
            href={`/register-completion/${completion.course.slug}`}
            style={{
              color: "red",
              marginRight: "0.5rem",
              visibility: RegisterButtonVisible ? "visible" : "hidden",
            }}
          >
            {t("registerButtonText")}
          </Button>
        )}
      </Background>
    </Grid>
  )
}

export default CompletedCourseCard
