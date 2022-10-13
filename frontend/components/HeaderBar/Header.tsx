import { ReactElement } from "react"

import { useRouter } from "next/router"

import styled from "@emotion/styled"
import { AppBar, Toolbar } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import Slide from "@mui/material/Slide"
import useScrollTrigger from "@mui/material/useScrollTrigger"

import LanguageSwitch from "./LanguageSwitch"
import LoggedInUserMenu from "./LoggedInUserMenu"
import MoocLogo from "./MoocLogo"
import UserOptionsMenu from "./UserOptionsMenu"
import { useLoginStateContext } from "/contexts/LoginStateContext"

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

const StyledToolbar = styled(Toolbar)`
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
  const { loggedIn } = useLoginStateContext()

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
            <UserOptionsMenu />
            <LanguageSwitch />
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
