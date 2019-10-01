import * as React from "react"
import { AppBar, Toolbar } from "@material-ui/core"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Slide from "@material-ui/core/Slide"
import LoggedInUserMenu from "./LoggedInUserMenu"
import MoocLogo from "./MoocLogo"
import LoginStateContext from "/contexes/LoginStateContext"
import UserOptionsMenu from "./UserOptionsMenu"
import styled from "styled-components"

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

const StyledToolbar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
`
const HiddenMenuContainer = styled.div`
  flex: 1;
  @media (max-width: 950px) {
    display: none;
  }
`
const MenuContainer = styled.div`
  flex: 1;
`
function Header() {
  return (
    <LoginStateContext.Consumer>
      {({ loggedIn, logInOrOut }) => (
        <React.Fragment>
          <CssBaseline />
          <HideOnScroll>
            <AppBar color="inherit">
              <StyledToolbar>
                <MoocLogo />
                <MenuContainer>
                  <HiddenMenuContainer>
                    {loggedIn && <LoggedInUserMenu />}
                  </HiddenMenuContainer>
                </MenuContainer>
                <UserOptionsMenu
                  isSignedIn={loggedIn}
                  logInOrOut={logInOrOut}
                />

                <LanguageSwitch />
              </StyledToolbar>
            </AppBar>
          </HideOnScroll>
        </React.Fragment>
      )}
    </LoginStateContext.Consumer>
  )
}

export default Header
