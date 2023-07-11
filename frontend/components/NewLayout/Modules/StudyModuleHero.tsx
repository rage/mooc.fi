import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/study-modules"

const Header = styled(Typography)`
  display: flex;
  justify-content: center;
  text-align: center;
` as typeof Typography

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
`

export function StudyModuleHero() {
  const t = useTranslator(StudyModulesTranslations)

  return (
    <Container>
      <Header
        component="h1"
        variant="h2"
        dangerouslySetInnerHTML={{
          __html: t("modulesTitle"),
        }}
      />
    </Container>
  )
}
