import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/study-modules"

const Header = styled(Typography)`
  display: flex;
  justify-content: center;
  text-align: center;
`

export function StudyModuleHero() {
  const t = useTranslator(StudyModulesTranslations)

  return (
    <Header
      variant="h1"
      dangerouslySetInnerHTML={{
        __html: t("modulesTitle"),
      }}
    />
  )
}
