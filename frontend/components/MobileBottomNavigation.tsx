import { useContext } from "react"

import LoginStateContext from "/contexts/LoginStateContext"

import styled from "@emotion/styled"
import AppBar, { AppBarProps } from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import { BoxProps } from "@mui/system"

import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"

const StyledBottomNavigation = styled(AppBar)<AppBarProps & BoxProps>`
  @media (min-width: 1050px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  const { loggedIn } = useContext(LoginStateContext)

  return loggedIn ? (
    <StyledBottomNavigation
      color="inherit"
      component="nav"
      aria-label="site navigation"
    >
      <Toolbar>
        <LoggedInUserMenu />
      </Toolbar>
    </StyledBottomNavigation>
  ) : null
}

export default MobileBottomNavigation
