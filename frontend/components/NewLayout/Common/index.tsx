import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

export const SectionTitle = styled((props: any) => (
  <Typography variant="h2" {...props} />
))``
export const SectionContainer = styled("section")`
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
