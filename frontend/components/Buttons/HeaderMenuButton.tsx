import { EnhancedButton } from "@mui/material"
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const HeaderMenuButton = styled(Button)`
  font-size: 1.25rem;
  margin: 0.5rem;
  @media (max-width: 450px) {
    font-size: 1rem;
    margin: 0.25rem;
  }
  @media (max-width: 321px) {
    font-size: 1.2rem;
    margin: 0;
  }
` as EnhancedButton
