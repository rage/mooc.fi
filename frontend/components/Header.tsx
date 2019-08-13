import * as React from "react"
import { AppBar, Toolbar, Typography, Avatar } from "@material-ui/core"
import NextI18Next from "../i18n"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Slide from "@material-ui/core/Slide"
import styled from "styled-components"
import UserMenu from "./UserMenu"

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
const ResponsiveMoocLogoContainer = styled.div`
  @media (max-width: 750px) {
    flex: 1;
  }
`
function Header() {
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar color="inherit">
          <Toolbar>
            <ResponsiveMoocLogoContainer>
              <NextI18Next.Link href="/" as="/">
                <HomeLink href="/" aria-label="MOOC.fi homepage">
                  <MoocLogo alt="MOOC logo" src="/static/images/moocfi.svg" />
                  <MoocLogoText>MOOC.fi</MoocLogoText>
                </HomeLink>
              </NextI18Next.Link>
            </ResponsiveMoocLogoContainer>
            <UserMenu />
            <LanguageSwitch />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  )
}

export default Header
