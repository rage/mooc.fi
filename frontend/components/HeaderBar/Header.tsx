import { ReactElement, useContext } from "react"

import styled from "@emotion/styled"
import { AppBar, Toolbar } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import Slide from "@mui/material/Slide"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import { useRouter } from "next/router"

import LanguageSwitch from "./LanguageSwitch"
import LoggedInUserMenu from "./LoggedInUserMenu"
import MoocLogo from "./MoocLogo"
import UserOptionsMenu from "./UserOptionsMenu"
import LoginStateContext from "/contexts/LoginStateContext"

interface Props {
  window?: () => Window
  children: ReactElement
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

const StyledToolbar = styled<any>(Toolbar)`
  display: flex;
  flex-direction: row;
`
const HiddenMenuContainer = styled.div`
  flex: 1;
  @media (max-width: 1050px) {
    display: none;
  }
`
const MenuContainer = styled.div`
  flex: 1;
`

export function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "^/(courses|study-modules|email-templates|profile|users)",
  )?.[1]
}

function Header() {
  const { loggedIn, logInOrOut } = useContext(LoginStateContext)

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar color="inherit" position="sticky" aria-label="user toolbar">
          <StyledToolbar>
            <MoocLogo />
            <MenuContainer>
              <HiddenMenuContainer>
                {loggedIn && <LoggedInUserMenu />}
              </HiddenMenuContainer>
            </MenuContainer>
            <UserOptionsMenu isSignedIn={loggedIn} logInOrOut={logInOrOut} />

            <LanguageSwitch />
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
