import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"

export const SectionTitle = styled((props: any) => (
  <Typography variant="h2" {...props} />
))``
export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding-top: 2rem;
  margin: auto;
`
