import { useCallback } from "react"

import dynamic from "next/dynamic"

import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import FormSkeleton from "/components/Dashboard/EditorLegacy/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

const StudyModuleEdit = dynamic(
  () => import("../../components/Dashboard/Editor/StudyModule"),
  { loading: () => <FormSkeleton /> },
)
const LegacyStudyModuleEdit = dynamic(
  () => import("../../components/Dashboard/EditorLegacy/StudyModule"),
  { loading: () => <FormSkeleton /> },
)

const NewStudyModule = () => {
  const t = useTranslator(StudyModulesTranslations)
  const legacy = useQueryParameter("legacy", { enforce: false })

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

  const EditorComponent = useCallback(() => {
    if (legacy) {
      return <LegacyStudyModuleEdit />
    }
    return <StudyModuleEdit />
  }, [legacy])

  return (
    <ContainerBackground>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("newStudyModule")}
        </H1NoBackground>
        <EditorComponent />
      </WideContainer>
    </ContainerBackground>
  )
}

export default withAdmin(NewStudyModule)
