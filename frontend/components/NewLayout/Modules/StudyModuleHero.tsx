import styled from "@emotion/styled"
import { Typography } from "@mui/material"

const Header = styled(Typography)`
  display: flex;
  justify-content: center;
`

export function StudyModuleHero() {
  return <Header variant="h1">Opintokokonaisuudet</Header>
}
