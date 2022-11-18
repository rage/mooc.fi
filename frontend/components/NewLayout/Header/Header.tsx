import styled from "@emotion/styled"
import { AppBar, Slide, Toolbar, useScrollTrigger } from "@mui/material"

import MoocLogo from "./MoocLogo"
import {
  DesktopNavigationMenu,
  MobileNavigationMenu,
} from "/components/NewLayout/Navigation"

interface HideOnScrollProps {
  window?: () => Window
  children: React.ReactElement
}

function HideOnScroll({ window, children }: HideOnScrollProps) {
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const StyledToolbar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
`

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`

function Header() {
  return (
    <>
      <HideOnScroll>
        <AppBar color="inherit" position="sticky" aria-label="user toolbar">
          <StyledToolbar>
            <MoocLogo />
            <MenuContainer>
              <DesktopNavigationMenu />
              <MobileNavigationMenu />
            </MenuContainer>
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
