import { AppBar, AppBarProps, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles" 

import { NavigationLinks } from "/components/NewLayout/Navigation/NavigationLinks"

const BottomNavigationContainer = styled((props: AppBarProps) => (
  <AppBar position="fixed" color="inherit" component="nav" {...props} />
))`
  @media (min-width: 600px) {
    display: none;
  }
  top: auto;
  bottom: 0;
`

export const BottomNavigation = () => {
  return (
    <BottomNavigationContainer>
      <Toolbar>
        <NavigationLinks />
      </Toolbar>
    </BottomNavigationContainer>
  )
}
