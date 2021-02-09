import { ReactElement } from "react"
import { AppBar, Toolbar } from "@material-ui/core"
import LanguageSwitch from "./LanguageSwitch"
import CssBaseline from "@material-ui/core/CssBaseline"
import useScrollTrigger from "@material-ui/core/useScrollTrigger"
import Slide from "@material-ui/core/Slide"
import LoggedInUserMenu from "./LoggedInUserMenu"
import MoocLogo from "./MoocLogo"
import LoginStateContext from "/contexes/LoginStateContext"
import UserOptionsMenu from "./UserOptionsMenu"
import styled from "@emotion/styled"
import LanguageContext from "/contexes/LanguageContext"
import { useContext } from "react"

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
  const urlParts = url.split("/")
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
        <AppBar color="inherit" position="sticky">
          <StyledToolbar>
            <MoocLogo />
            <MenuContainer>
              <HiddenMenuContainer>
                {loggedIn && (
                  <LoggedInUserMenu active={active ? active : undefined} />
                )}
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
