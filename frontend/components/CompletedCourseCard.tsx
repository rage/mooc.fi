import DoneIcon from "@mui/icons-material/Done"
import { Button, Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ClickableDiv } from "/components/Surfaces/ClickableCard"
import { useTranslator } from "/hooks/useTranslator"
import CompletionsTranslations from "/translations/completions"
import ProfileTranslations from "/translations/profile"
import { formatDateTime, mapLangToLanguage } from "/util/dataFormatFunctions"

import {
  CompletionDetailedFieldsFragment,
  CourseWithPhotoCoreFieldsFragment,
} from "/graphql/generated"

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
` as typeof Typography

const CardText = styled(Typography)`
  margin: 0.5rem;
  padding-top: 0.2rem;
`
const RegistrationDetails = styled("div")`
  display: flex;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
`

const StyledDoneIcon = styled(DoneIcon)`
  color: green;
  margin-top: 0.5rem;
`

const RegisterButton = styled(Button)`
  color: red;
  margin-right: 0.5rem;
`

interface CourseCardProps {
  completion: CompletionDetailedFieldsFragment & {
    course: CourseWithPhotoCoreFieldsFragment
  }
}

function CompletedCourseCard(props: CourseCardProps) {
  const { completion } = props
  const registeredCompletions = completion?.completions_registered ?? []
  const isRegistered = registeredCompletions.length > 0

  const t = useTranslator(CompletionsTranslations, ProfileTranslations)

  const humanReadableLanguage =
    mapLangToLanguage[completion?.completion_language ?? ""] ??
    completion?.completion_language ??
    "no language available"

  return (
    <Grid item xs={12}>
      <Background>
        <CourseTitle component="h3" variant="h6" gutterBottom>
          {completion.course?.name}
        </CourseTitle>
        <CardText>
          {t("completedDate")} {formatDateTime(completion.created_at)}
        </CardText>
        <CardText>
          {t("completionLanguage")}
          {humanReadableLanguage}
        </CardText>
        {isRegistered ? (
          registeredCompletions.map((r) => (
            <RegistrationDetails key={r.id}>
              <CardText>
                {t("registeredDate")} {formatDateTime(r.created_at)}
              </CardText>
              <CardText>
                {r.organization ? r.organization.slug : "Unknown organization"}
              </CardText>

              <StyledDoneIcon />
            </RegistrationDetails>
          ))
        ) : (
          <RegisterButton
            href={`/register-completion/${completion.course?.slug}`}
          >
            {t("registerButtonText")}
          </RegisterButton>
        )}
      </Background>
    </Grid>
  )
}

export default CompletedCourseCard
