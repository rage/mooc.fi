import React, { useContext } from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import DoneIcon from "@material-ui/icons/Done"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"
import { mapLangToLanguage } from "/components/DataFormatFunctions"

const Background = styled(ClickableDiv)`
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

interface CourseCardProps {
  completion: ProfileUserOverView_currentUser_completions
}

function formatDateTime(date: string) {
  const dateToFormat = new Date(date)
  const formattedDate = dateToFormat.toUTCString()
  return formattedDate
}

function CompletedCourseCard(props: CourseCardProps) {
  const { completion } = props

  const registeredCompletions = completion?.completions_registered ?? []
  const isRegistered = registeredCompletions.length > 0

  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)

  const humanReadableLanguage =
    mapLangToLanguage[completion?.completion_language ?? ""] ||
    completion?.completion_language ||
    "no language available"

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
          registeredCompletions.map(r => (
            <RegistrationDetails>
              <CardText>
                {t("registeredDate")} {formatDateTime(r.created_at)}
              </CardText>
              <CardText>
                {r.organization ? r.organization.slug : "Unknown organization"}
              </CardText>

              <DoneIcon style={{ color: "green", marginTop: "0.5rem" }} />
            </RegistrationDetails>
          ))
        ) : (
          <Button
            href={`/register-completion/${completion.course.slug}`}
            style={{
              color: "red",
              marginRight: "0.5rem",
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
