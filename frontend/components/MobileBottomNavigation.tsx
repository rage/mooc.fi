import dynamic from "next/dynamic"

import AppBar, { AppBarProps } from "@mui/material/AppBar"
import { styled } from "@mui/material/styles"
import Toolbar from "@mui/material/Toolbar"
import { BoxProps } from "@mui/system"

const StyledBottomNavigation = styled(AppBar)<AppBarProps & BoxProps>`
  @media (min-width: 1050px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const LoggedInUserMenu = dynamic(() => import("./HeaderBar/LoggedInUserMenu"), {
  loading: () => null,
})

const MobileBottomNavigation = () => {
  return (
    <StyledBottomNavigation
      color="inherit"
      component="nav"
      aria-label="site navigation"
    >
      <Toolbar>
        <LoggedInUserMenu />
      </Toolbar>
    </StyledBottomNavigation>
  )
}

export default MobileBottomNavigation
