import * as React from "react"
import { ApolloClient, gql } from "apollo-boost"
import { NextContext } from "next"
import { isSignedIn, userDetails } from "../lib/authentication"
import redirect from "../lib/redirect"
import { useQuery } from "react-apollo-hooks"
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView"
import { Typography, Paper, SvgIcon } from "@material-ui/core"
import RegisterCompletionText from "../components/RegisterCompletionText"
import ImportantNotice from "../components/ImportantNotice"
import Container from "../components/Container"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { withRouter } from "next/router"

const useStyles = makeStyles((theme: Theme) =>
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
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      completions {
        id
        completion_language
        student_number
        course {
          id
          slug
        }
      }
    }
  }
`
const mapLanguageToLink = new Map(
  Object.entries({
    fi_FI: "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=129202330",
    en_US: "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=129202817",
    sv_SE: "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002",
  }),
)

interface RegisterCompletionPageProps {
  t: Function
  router: any
}
const RegisterCompletion = (props: RegisterCompletionPageProps) => {
  const { t, router } = props
  const classes = useStyles()
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

  const courseSlug = router.query.slug

  const completion = data.currentUser.completions.find(
    c => c.course.slug === courseSlug,
  )

  const courseLinkWithLanguage =
    mapLanguageToLink.get(completion.completion_language) ||
    "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=129202330"

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
  return {
    namespacesRequired: ["register-completion"],
  }
}

export default withRouter(
  NextI18Next.withTranslation("register-completion")(RegisterCompletion),
)
