import styled from "@emotion/styled"
import { Typography } from "@mui/material"

const Container = styled.header`
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
