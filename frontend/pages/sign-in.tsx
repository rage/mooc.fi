<<<<<<< HEAD
import * as React from "react";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";
import { Paper, Avatar, Typography } from '@material-ui/core'
import NextI18Next from '../i18n';
import SignInForm from '../components/SignInForm'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '../components/Container'
=======
import * as React from "react"
import { NextContext } from "next"
import { isSignedIn } from "../lib/authentication"
import redirect from "../lib/redirect"
import { Paper, Avatar, Typography } from "@material-ui/core"
import NextI18Next from "../i18n"
import SignInForm from "../components/SignInForm"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Container from "../components/Container"
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

const useStyles = makeStyles((theme: Theme) =>
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
    },
    avatar: {
      margin: "1rem",
    },
  }),
)

const SignInPage = ({ t }) => {
  const classes = useStyles()
  return (
<<<<<<< HEAD
      <Container>
=======
    <Container>
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom={true}>
          {t("login")}
        </Typography>
        <SignInForm />
      </Paper>
<<<<<<< HEAD
      </Container>
   
=======
    </Container>
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
SignInPage.getInitialProps = function(context: NextContext) {
  if (isSignedIn(context)) {
    redirect(context, "/register-completion")
  }
  return {
    namespacesRequired: ["common"],
  }
}

export default NextI18Next.withNamespaces("common")(SignInPage)
