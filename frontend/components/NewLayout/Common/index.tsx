import styled from "@emotion/styled"
import Typography, { TypographyProps } from "@mui/material/Typography"

export const SectionTitle = styled((props: TypographyProps) => (
  <Typography variant="h1" {...props} />
))``

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding-top: 2rem;
  margin: auto;
  @media (max-width: 400px) {
    margin: 0;
  }
`

export const CorrectedAnchor = styled("a")`
  display: block;
  position: relative;
  top: -120px;
  visibility: hidden;
`
