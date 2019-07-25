import * as React from "react"
import IconButton from "@material-ui/core/IconButton"
import Popover from "@material-ui/core/Popover"
import MenuIcon from "@material-ui/icons/Menu"
import MenuOptionButtons from "./MenuOptionButtons"
import styled from "styled-components"

const MobileHamburgerMenu = styled.div`
  @media (min-width: 750px) {
    display: none;
  }
`

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(event.currentTarget)
  }
  function handleClose() {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  return (
    <MobileHamburgerMenu>
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuOptionButtons />
      </Popover>
    </MobileHamburgerMenu>
  )
}

export default HamburgerMenu
