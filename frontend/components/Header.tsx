import * as React from "react"
import { AppBar, Toolbar, Typography, Button, Avatar } from "@material-ui/core"
import { signOut } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import { useApolloClient } from "react-apollo-hooks"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import NextI18Next from "../i18n"
import LanguageSwitch from "./LanguageSwitch"

function TitleText(props: any) {
  return (
    <Typography variant="body1" {...props}>
      MOOC.fi
    </Typography>
  )
}

function LogoImage(props: any) {
  return <Avatar alt="MOOC logo" src="../static/images/moocfi.svg" {...props} />
}

function LogOutButton(props: any) {
  return (
    <Button color="inherit" onClick={props.onclick}>
      <NextI18Next.Trans i18nKey="logout" />
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontFamily: "Open Sans Condensed Light, sans-serif",
      fontSize: "1.75rem",
      marginTop: "1.6rem",
    },
    avatar: {
      margin: "1em",
      height: "3em",
      width: "3em",
    },
    link: {
      color: "black",
      textDecoration: "none",
      display: "flex",
      flexDirection: "row",
    },
  }),
)

function Header() {
  const classes = useStyles()
  const loggedIn = React.useContext(LoginStateContext)
  const client = useApolloClient()

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <div style={{ flex: 1 }}>
          <NextI18Next.Link href="/">
            <a href="/" aria-label="MOOC.fi homepage" className={classes.link}>
              <LogoImage classes={{ root: classes.avatar }} />
              <TitleText className={classes.title} />
            </a>
          </NextI18Next.Link>
        </div>
        <LanguageSwitch />
        {loggedIn && <LogOutButton onclick={() => signOut(client)} />}
      </Toolbar>
    </AppBar>
  )
}

export default NextI18Next.withTranslation("common")(Header)
