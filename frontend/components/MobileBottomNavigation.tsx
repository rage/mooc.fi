import React from "react"
import styled from "styled-components"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"
import LoginStateContext from "/contexes/LoginStateContext"
import { whichIsActive } from "/components/HeaderBar/Header"
import LanguageContext from "/contexes/LanguageContext"

const StyledBottomNavigation = styled(AppBar)`
  @media (min-width: 950px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

const MobileBottomNavigation = () => {
  const currentHref = React.useContext(LanguageContext).url
  const active = whichIsActive({ url: currentHref })
  return (
    <LoginStateContext.Consumer>
      {({ loggedIn }) =>
        loggedIn && (
          <StyledBottomNavigation color="inherit">
            <Toolbar>
              <LoggedInUserMenu active={active} />
            </Toolbar>
          </StyledBottomNavigation>
        )
      }
    </LoginStateContext.Consumer>
  )
}

export default MobileBottomNavigation
