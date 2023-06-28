import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const CardText = styled(Typography)`
  margin-bottom: 0.5rem;
  margin-top: 0.2rem;
  color: black;
` as typeof Typography

export const CardCaption = styled(Typography)`
  font-family: var(--header-font) !important;
` as typeof Typography
