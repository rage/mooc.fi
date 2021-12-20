import { ReactElement } from "react"
import { AppBar, Toolbar, Chip } from "@mui/material"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@mui/material/CssBaseline"
import useScrollTrigger from "@mui/material/useScrollTrigger"
import Slide from "@mui/material/Slide"
import LoggedInUserMenu from "./LoggedInUserMenu"
import MoocLogo from "./MoocLogo"
import LoginStateContext from "/contexts/LoginStateContext"
import UserOptionsMenu from "./UserOptionsMenu"
import styled from "@emotion/styled"
import LanguageContext from "/contexts/LanguageContext"
import { useContext } from "react"

import { BACKEND_URL } from "/config"

const isStaging = (BACKEND_URL ?? "").includes("staging")

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

export function whichIsActive({ url }: { url: string }) {
  const urlParts = url?.split("/") ?? []
  const active = urlParts.length >= 3 ? urlParts[2] : ""

  return active
}

function Header() {
  const { url } = useContext(LanguageContext)
  const { loggedIn, logInOrOut } = useContext(LoginStateContext)
  const active = whichIsActive({ url })

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar color="inherit" position="sticky" aria-label="user toolbar">
          <StyledToolbar>
            <MoocLogo />
            <MenuContainer>
              <HiddenMenuContainer>
                {loggedIn && (
                  <LoggedInUserMenu active={active ? active : undefined} />
                )}
              </HiddenMenuContainer>
            </MenuContainer>
            {isStaging && <Chip label="STAGING" color="secondary" />}
            <UserOptionsMenu isSignedIn={loggedIn} logInOrOut={logInOrOut} />

            <LanguageSwitch />
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
