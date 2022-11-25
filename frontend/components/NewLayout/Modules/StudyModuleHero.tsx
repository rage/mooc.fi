import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const Container = styled("header")`
  display: flex;
  justify-content: center;
`

export function StudyModuleHero() {
  return (
    <Container>
      <Typography variant="h1">Opintokokonaisuudet</Typography>
    </Container>
  )
}
