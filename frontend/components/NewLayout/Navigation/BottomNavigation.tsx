import { AppBar, AppBarProps, Toolbar } from "@mui/material"
import { styled } from "@mui/material/styles"

import { NavigationLinks } from "/components/NewLayout/Navigation/NavigationLinks"

const BottomNavigationContainer = styled((props: AppBarProps) => (
  <AppBar position="fixed" color="inherit" component="nav" {...props} />
))(
  ({ theme }) => `
  ${theme.breakpoints.up("md")} {
    display: none;
  }
  top: auto;
  margin: auto;
  bottom: 0;
`,
)

export const BottomNavigation = () => {
  return (
    <BottomNavigationContainer>
      <Toolbar>
        <NavigationLinks />
      </Toolbar>
    </BottomNavigationContainer>
  )
}
