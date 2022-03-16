import { useContext } from "react"

import { whichIsActive } from "/components/HeaderBar/Header"
import LanguageContext from "/contexts/LanguageContext"
import LoginStateContext from "/contexts/LoginStateContext"

import styled from "@emotion/styled"
import { BoxProps } from "@mui/material"
import AppBar, { AppBarProps } from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"

import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"

const StyledBottomNavigation = styled(AppBar)<AppBarProps & BoxProps>`
  @media (min-width: 1050px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  const { url } = useContext(LanguageContext)
  const { loggedIn } = useContext(LoginStateContext)
  const active = whichIsActive({ url }) ?? undefined

  return loggedIn ? (
    <StyledBottomNavigation
      color="inherit"
      component="nav"
      aria-label="site navigation"
    >
      <Toolbar>
        <LoggedInUserMenu active={active} />
      </Toolbar>
    </StyledBottomNavigation>
  ) : null
}

export default MobileBottomNavigation
