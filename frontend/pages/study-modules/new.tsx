import { styled } from "@mui/material/styles"

import StudyModuleEdit2 from "../../components/Dashboard/Editor/StudyModule"
import StudyModuleEdit from "../../components/Dashboard/EditorLegacy/StudyModule"
import { WideContainer } from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

const NewStudyModule = () => {
  const t = useTranslator(StudyModulesTranslations)
  const legacy = useQueryParameter("legacy", false)

  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
    {
      translation: "studyModuleNew",
      href: `/study-modules/new`,
    },
  ])

  return (
    <ContainerBackground>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("newStudyModule")}
        </H1NoBackground>
        {legacy ? <StudyModuleEdit /> : <StudyModuleEdit2 />}
      </WideContainer>
    </ContainerBackground>
  )
}

export default withAdmin(NewStudyModule)
