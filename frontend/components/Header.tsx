import * as React from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Popover,
} from "@material-ui/core"
import { signOut } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import { useApolloClient } from "react-apollo-hooks"
import NextI18Next from "../i18n"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Slide from "@material-ui/core/Slide"
import withWidth from "@material-ui/core/withWidth"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import styled from "styled-components"

interface LogoutButtonProps {
  width: string
  onclick: any
}

function LogOutButton(props: LogoutButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const { width, onclick } = props

  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  if (width === "xs") {
    return (
      <div>
        <IconButton onClick={handleClick}>
          <MenuIcon style={{ height: "2.5rem", width: "2.5rem" }} />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Button color="inherit" onClick={onclick}>
            <NextI18Next.Trans i18nKey="logout" />
          </Button>
          {/*<Button color="inherit" href="/my-profile">
            <NextI18Next.Trans i18nKey="profile" />
        </Button>*/}
        </Popover>
      </div>
    )
  }

  return (
    <span style={{ padding: "1rem" }}>
      <Button color="inherit" onClick={onclick}>
        <NextI18Next.Trans i18nKey="logout" />
      </Button>
      {/*<Button color="inherit" href="/my-profile">
        <NextI18Next.Trans i18nKey="profile" />
        </Button>*/}
    </span>
  )
}

function LogInButton() {
  return (
    <Button color="inherit" href="/sign-in" style={{ padding: "1rem" }}>
      <NextI18Next.Trans i18nKey="loginShort" />
    </Button>
  )
}

interface Props {
  window?: () => Window
  children: React.ReactElement
}

function HideOnScroll(props: Props) {
  const { children, window } = props
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const MoocLogoText = styled(Typography)`
  font-family: "Open Sans Condensed Light", sans-serif;
  font-size: 1.75rem;
  margin-top: 1rem;
`

const MoocLogo = styled(Avatar)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0px;
  margin-right: 0.5rem;
  height: 3em;
  width: 3em;
`
const HomeLink = styled.a`
  color: black;
  text-decoration: none;
  display: flex;
  flex-direction: row;
`
interface HeaderProps {
  width: string
}

function Header(props: HeaderProps) {
  const { width } = props
  const loggedIn = React.useContext(LoginStateContext)
  const client = useApolloClient()

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar color="inherit">
          <Toolbar>
            <div style={{ flex: 1 }}>
              <NextI18Next.Link href="/">
                <HomeLink href="/" aria-label="MOOC.fi homepage">
                  <MoocLogo alt="MOOC logo" src="../static/images/moocfi.svg" />
                  <MoocLogoText>MOOC.fi</MoocLogoText>
                </HomeLink>
              </NextI18Next.Link>
            </div>
            <LanguageSwitch />
            {loggedIn ? (
              <LogOutButton onclick={() => signOut(client)} width={width} />
            ) : (
              <LogInButton />
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  )
}

export default NextI18Next.withTranslation("common")(withWidth()(Header))
