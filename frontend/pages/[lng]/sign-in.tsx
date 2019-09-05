import * as React from "react"
import { NextPageContext as NextContext } from "next"
import { isSignedIn } from "/lib/authentication"
import redirect from "/lib/redirect"
import Paper from "@material-ui/core/Paper"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import SignInForm from "/components/SignInForm"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getSignInTranslator from "/translations/common"
import { useContext } from "react"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      widht: "auto",
      display: "block",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1em",
      marginTop: "2em",
    },
    avatar: {
      margin: "1rem",
    },
  }),
)

const SignInPage = () => {
  const lng = useContext(LanguageContext)
  const t = getSignInTranslator(lng.language)
  const classes = useStyles()
  return (
    <Container style={{ width: "90%", maxWidth: 900 }}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom={true}>
          {t("login")}
        </Typography>
        <SignInForm />
      </Paper>
    </Container>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
SignInPage.getInitialProps = function(context: NextContext) {
  if (isSignedIn(context)) {
    redirect(context, "/")
  }
  return {}
}

export default SignInPage
