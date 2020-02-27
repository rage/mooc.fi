import React, { useContext } from "react"
import styled from "styled-components"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import LoggedInUserMenu from "./HeaderBar/LoggedInUserMenu"
import LoginStateContext from "/contexes/LoginStateContext"
import { whichIsActive } from "/components/HeaderBar/Header"
import LanguageContext from "/contexes/LanguageContext"

const StyledBottomNavigation = styled(AppBar)`
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
    <StyledBottomNavigation color="inherit">
      <Toolbar>
        <LoggedInUserMenu active={active} />
      </Toolbar>
    </StyledBottomNavigation>
  ) : null
}

export default MobileBottomNavigation
