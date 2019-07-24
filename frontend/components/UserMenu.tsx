import * as React from "react"
import styled from "styled-components"
import HamburgerMenu from "./HamburgerMenu"
import MenuOptionButtons from "./MenuOptionButtons"

const LargeScreenButtonMenu = styled.div`
  display: flex;
  flexdirection: row;
  margin: auto;
  @media (max-width: 750px) {
    display: none;
  }
`

const UserMenu = () => {
  return (
    <React.Fragment>
      <LargeScreenButtonMenu>
        <MenuOptionButtons />
      </LargeScreenButtonMenu>

      <HamburgerMenu />
    </React.Fragment>
  )
}

export default UserMenu
