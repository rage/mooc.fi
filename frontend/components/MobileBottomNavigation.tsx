import styled from "@emotion/styled"
import { AppBar, BoxProps, Toolbar } from "@mui/material"
import { AppBarProps } from "@mui/material/AppBar"

import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"
import { useLoginStateContext } from "/contexts/LoginStateContext"

const StyledBottomNavigation = styled(AppBar)<AppBarProps & BoxProps>`
  @media (min-width: 1050px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  const { loggedIn, admin } = useLoginStateContext()

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
