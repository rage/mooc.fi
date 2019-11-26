import * as React from "react"
import { gql } from "apollo-boost"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import { useQuery } from "@apollo/react-hooks"
import { RegisterCompletionUserOverView as UserOverViewData } from "/static/types/generated/RegisterCompletionUserOverView"
import { Typography, Paper, SvgIcon } from "@material-ui/core"
import RegisterCompletionText from "/components/RegisterCompletionText"
import ImportantNotice from "/components/ImportantNotice"
import Container from "/components/Container"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import LanguageContext from "/contexes/LanguageContext"
import getRegisterCompletionTranslator from "/translations/register-completion"
import { useContext } from "react"
import { H1NoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      padding: "1em",
      margin: "1em",
    },
    icon: {
      width: 30,
      height: 30,
      margin: "0.5em",
    },
    paperWithRow: {
      padding: "1em",
      margin: "1em",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    paperWithColumn: {
      padding: "1em",
      margin: "1em",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    courseInfo: {
      marginTop: 0,
      marginLeft: "1em",
    },
  }),
)

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
          created_at
          organization {
            slug
          }
        }
      }
    }
  }
`

interface RegisterCompletionPageProps {
  slug?: string | string[]
}

const RegisterCompletion = (props: RegisterCompletionPageProps) => {
  const { slug } = props
  const classes = useStyles()
  const { language } = useContext(LanguageContext)

  const t = getRegisterCompletionTranslator(language)
  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)

  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  const courseSlug = slug || useQueryParameter("slug")

  const completion =
    data?.currentUser?.completions?.find(c => c.course.slug == courseSlug) ??
    undefined

  if (!data.currentUser) {
    return <div>You are not logged in. Please log in to the site</div>
  }

  if (!completion) {
    return (
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("course_completion_not_found_title")}
        </H1NoBackground>
        <Typography>{t("course_completion_not_found")}</Typography>
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
        <Paper className={classes.paper}>
          <Typography variant="body1" paragraph>
            {t("open_university_registration_not_open")}{" "}
            {completion.course.name} {completion.completion_language}.
          </Typography>
        </Paper>
      </div>
    )
  }

  return (
    <>
      <Container>
        <H1NoBackground variant="h1" component="h1" align="center">
          {t("title")}
        </H1NoBackground>
        <Typography variant="h6" component="p" className={classes.courseInfo}>
          {t("course", { course: completion.course.name })}
        </Typography>
        <Typography
          variant="h6"
          component="p"
          className={classes.courseInfo}
          gutterBottom={true}
        >
          {t("credits", { ects: completion.course.ects })}
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="body1" paragraph>
            {t("credits_details")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("donow")}
          </Typography>
        </Paper>
        <ImportantNotice email={completion.email} />
        <RegisterCompletionText
          email={completion.email}
          link={courseLinkWithLanguage}
        />
        <Paper className={classes.paperWithColumn}>
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
        </Paper>
        <Paper className={classes.paperWithRow}>
          <SvgIcon className={classes.icon} color="primary">
            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </SvgIcon>
          <Typography variant="body1">{t("NB")}</Typography>
        </Paper>
      </Container>
    </>
  )
}

RegisterCompletion.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in", true)
  }
  return {}
}

export default RegisterCompletion
