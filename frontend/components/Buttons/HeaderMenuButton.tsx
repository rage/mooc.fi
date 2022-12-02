import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const HeaderMenuButton = styled(Button)`
  font-size: 18px;
  @media (max-width: 450px) {
    font-size: 16px;
  }
  @media (max-width: 321px) {
    margin-left: 0.25rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  margin: 0.5rem;
`
