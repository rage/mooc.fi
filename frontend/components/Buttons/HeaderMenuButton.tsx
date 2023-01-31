import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const HeaderMenuButton = styled(Button)(
  ({ theme }) => `
  font-size: 1.25rem;
  margin: 0.5rem;
  ${theme.breakpoints.down("md")} {
    font-size: 1rem;
  }
  ${theme.breakpoints.down("xs")} {
    font-size: 1.2rem;
    margin-left: 0.25rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
`,
) as typeof Button
