import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const Header = styled(Typography)`
  display: flex;
  justify-content: center;
  text-align: center;
`

export function StudyModuleHero() {
  return (
    <Header
      variant="h1"
      dangerouslySetInnerHTML={{
        __html: "Opinto&shy;kokonaisuudet",
      }}
    />
  )
}
