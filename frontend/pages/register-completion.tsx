import * as React from "react"
import { ApolloClient, gql } from "apollo-boost"
import { NextContext } from "next"
import { isSignedIn, userDetails } from "../lib/authentication"
<<<<<<< HEAD
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import { 
  Typography, 
  Paper,
  SvgIcon } from "@material-ui/core";
import RegisterCompletionText from '../components/RegisterCompletionText'
import ImportantNotice from '../components/ImportantNotice'
import Container from '../components/Container'
import NextI18Next from '../i18n';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
=======
import redirect from "../lib/redirect"
import { useQuery } from "react-apollo-hooks"
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView"
import { Typography, Paper, SvgIcon } from "@material-ui/core"
import RegisterCompletionText from "../components/RegisterCompletionText"
import ImportantNotice from "../components/ImportantNotice"
import Container from "../components/Container"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

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
    }
  }
`

const RegisterCompletion = ({ t }) => {
  const classes = useStyles()
  const { loading, error, data } = useQuery<UserOverViewData>(UserOverViewQuery)
  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

<<<<<<< HEAD
    if (loading || !data) {
        return <div>Loading</div>;
    }
    return (
      <Container>
        <Typography 
          variant="h2" 
          component='h1'  
          gutterBottom={true} 
          align='center' 
          className={classes.title}>
          {t('title')}
        </Typography>
        <Typography variant="h6" component='p'className={classes.courseInfo} >
          {t('course')}
=======
  if (loading || !data) {
    return <div>Loading</div>
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
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
        </Typography>
        <Typography variant="body1" paragraph>
          {t("donow")}
        </Typography>
      </Paper>
      <ImportantNotice email={data.currentUser.email} />
      <RegisterCompletionText
        email={data.currentUser.email}
        link=" https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002"
<<<<<<< HEAD
        />
        <Paper className={classes.paperWithRow}>
          <SvgIcon className={classes.icon} color='primary'>
             <path  d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </SvgIcon>
          <Typography variant='body1'>
            {t('NB')}
          </Typography>
        </Paper>
        </Container>
=======
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
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

RegisterCompletion.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    namespacesRequired: ["register-completion"],
  }
}

export default NextI18Next.withNamespaces("register-completion")(
  RegisterCompletion,
)
