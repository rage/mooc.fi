import * as React from "react"
import { AppBar, Toolbar, Typography, Button, Avatar } from "@material-ui/core"
import { signOut } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import { useApolloClient } from "react-apollo-hooks"
import NextI18Next from "../i18n"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Slide from "@material-ui/core/Slide"
import styled from "styled-components"

interface MenuProps {
  onclick: any
  isLoggedIn: boolean
}

const HeaderButtonContainer = styled.div`
  display: flex;
  flexdirection: row;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const LogOutButtonContainer = styled.div`
  display: flex;
  flexdirection: row;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`

function HeaderMenu(props: MenuProps) {
  const { onclick, isLoggedIn } = props

  return (
    <HeaderButtonContainer>
      <LanguageSwitch />
      {isLoggedIn ? (
        <LogOutButtonContainer>
          <Button color="inherit" onClick={onclick}>
            <NextI18Next.Trans i18nKey="common:logout" />
          </Button>
          <Button color="inherit" href="/my-profile">
            <NextI18Next.Trans i18nKey="common:profile" />
          </Button>
        </LogOutButtonContainer>
      ) : (
        <LogInButton />
      )}
    </HeaderButtonContainer>
  )
}

function LogInButton() {
  return (
    <Button color="inherit" href="/sign-in">
      <NextI18Next.Trans i18nKey="common:loginShort" />
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

function Header() {
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

            <HeaderMenu onclick={() => signOut(client)} isLoggedIn={loggedIn} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  )
}

export default Header
