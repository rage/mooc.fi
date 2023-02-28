import { EnhancedButton } from "@mui/material"
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const HeaderMenuButton = styled(Button)`
  font-size: 1.25rem;
  margin: 0.5rem;
  @media (max-width: 450px) {
    font-size: 1rem;
  }
  @media (max-width: 321px) {
    font-size: 1.2rem;
    margin-left: 0.25rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
` as EnhancedButton
