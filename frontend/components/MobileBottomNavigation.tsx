import React from "react"
import styled from "styled-components"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"
import LoginStateContext from "/contexes/LoginStateContext"

const StyledBottomNavigation = styled(AppBar)`
  @media (min-width: 950px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  return (
    <LoginStateContext.Consumer>
      {({ loggedIn }) =>
        loggedIn && (
          <StyledBottomNavigation>
            <Toolbar>
              <LoggedInUserMenu />
            </Toolbar>
          </StyledBottomNavigation>
        )
      }
    </LoginStateContext.Consumer>
  )
}

export default MobileBottomNavigation
