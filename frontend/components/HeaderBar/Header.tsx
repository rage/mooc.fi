import { ReactElement } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import {
  AppBar,
  CssBaseline,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import LanguageSwitch from "./LanguageSwitch"
import MoocLogo from "./MoocLogo"
import UserOptionsMenu from "./UserOptionsMenu"
import { useLoginStateContext } from "/contexts/LoginStateContext"

interface Props {
  window?: () => Window
  children: ReactElement
}

const LoggedInUserMenu = dynamic(() => import("./LoggedInUserMenu"), {
  loading: () => null,
})

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

const HiddenMenuContainer = styled("div")`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: flex-end;
  @media (max-width: 1050px) {
    display: none;
  }
`

const MenuContainer = styled("div")`
  flex: 1;
  height: 95px;
`

const OptionsContainer = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
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
            <OptionsContainer>
              <UserOptionsMenu />
              <LanguageSwitch />
            </OptionsContainer>
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
