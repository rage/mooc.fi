import { useContext } from "react"

import styled from "@emotion/styled"
import AppBar, { AppBarProps } from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import { BoxProps } from "@mui/system"

import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"
import LoginStateContext from "/contexts/LoginStateContext"

const StyledBottomNavigation = styled(AppBar)<AppBarProps & BoxProps>`
  @media (min-width: 1050px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  const { loggedIn, admin } = useContext(LoginStateContext)

  // there's currently nothing to show for non-admin users here, so don't show an empty toolbar
  return loggedIn && admin ? (
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
