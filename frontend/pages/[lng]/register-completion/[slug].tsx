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
import { withRouter } from "next/router"
import LanguageContext from "/contexes/LanguageContext"
import getRegisterCompletionTranslator from "/translations/register-completion"
import { useContext } from "react"

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
    title: {
      marginBottom: "1em",
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
      email
      completions {
        id
        completion_language
        completion_link
        student_number
        created_at
        course {
          id
          slug
          name
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
  router: any
  slug?: string | string[]
}

const RegisterCompletion = (props: RegisterCompletionPageProps) => {
  const { router, slug } = props
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

  const courseSlug = slug || router.query.slug
  let completion = undefined

  if (!data.currentUser) {
    return <div>You are not logged in. Please log in to the site</div>
  }

  if (data.currentUser.completions) {
    completion = data.currentUser.completions.find(
      c => c.course.slug === courseSlug,
    )
  }

  if (!completion) {
    return (
      <Container>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom={true}
          align="center"
          className={classes.title}
        >
          {t("course_completion_not_found_title")}
        </Typography>
        <Typography>{t("course_completion_not_found")}</Typography>
      </Container>
    )
  }

  //map completions language to a link
  let courseLinkWithLanguage = null

  //if completion has a language field defined
  if (completion.completion_link) {
    courseLinkWithLanguage = completion.completion_link
  }

  if (!courseLinkWithLanguage) {
    return <div>Open University registration is not open at the moment.</div>
  }

  return (
    <Container>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom={true}
        align="center"
        className={classes.title}
      >
        {t("title")}
      </Typography>
      <Typography variant="h6" component="p" className={classes.courseInfo}>
        {t("course")}
      </Typography>
      <Typography
        variant="h6"
        component="p"
        className={classes.courseInfo}
        gutterBottom={true}
      >
        {t("credits")}
      </Typography>
      <Paper className={classes.paper}>
        <Typography variant="body1" paragraph>
          {t("credits_details")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("donow")}
        </Typography>
      </Paper>
      <ImportantNotice email={data.currentUser.email} />
      <RegisterCompletionText
        email={data.currentUser.email}
        link={courseLinkWithLanguage}
      />
      <Paper className={classes.paperWithRow}>
        <SvgIcon className={classes.icon} color="primary">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </SvgIcon>
        <Typography variant="body1">{t("NB")}</Typography>
      </Paper>
    </Container>
  )
}

RegisterCompletion.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in", true)
  }
  return {}
}

export default withRouter(RegisterCompletion)
