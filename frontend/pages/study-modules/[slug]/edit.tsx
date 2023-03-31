import { useCallback, useEffect } from "react"

import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"

import { EditorStudyModuleDetailsDocument } from "/graphql/generated"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

const StudyModuleEdit = dynamic(
  () => import("../../../components/Dashboard/Editor/StudyModule"),
  { loading: () => <FormSkeleton /> },
)
const LegacyStudyModuleEdit = dynamic(
  () => import("../../../components/Dashboard/EditorLegacy/StudyModule"),
  { loading: () => <FormSkeleton /> },
)

const EditStudyModule = () => {
  const router = useRouter()
  const t = useTranslator(StudyModulesTranslations)

  const slug = useQueryParameter("slug")
  const legacy = useQueryParameter("legacy", false)

  const { data, loading, error } = useQuery(EditorStudyModuleDetailsDocument, {
    variables: { slug },
  })

  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
    {
      label: data?.study_module?.name,
    },
    {
      translation: "studyModuleEdit",
      href: `/study-modules/${slug}/edit`,
    },
  ])
  const title = data?.study_module?.name ?? "..."

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout | null = null

    if (typeof window === "undefined") {
      return
    }

    if (!loading && !data?.study_module) {
      redirectTimeout = setTimeout(
        () => router.push("/study-modules", undefined, { shallow: true }),
        5000,
      )
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [loading, data])

  const EditorComponent = useCallback(() => {
    if (!data?.study_module) {
      return null
    }

    if (legacy) {
      return <LegacyStudyModuleEdit module={data.study_module} />
    }

    return <StudyModuleEdit module={data.study_module} />
  }, [data, legacy])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <>
      <NextSeo title={title} />
      <ContainerBackground>
        <WideContainer>
          <H1NoBackground component="h1" variant="h1" align="center">
            {t("editStudyModule")}
          </H1NoBackground>
          {loading && <FormSkeleton />}
          {!loading && data?.study_module && <EditorComponent />}
          {!loading && !data?.study_module && (
            <ErrorContainer elevation={2}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t("moduleWithIdNotFound", { slug }),
                }}
              />
              <Typography variant="body2">
                {t("redirectMessagePre")}
                <Link href="/study-modules">{t("redirectLinkText")}</Link>
                {t("redirectMessagePost")}
              </Typography>
            </ErrorContainer>
          )}
        </WideContainer>
      </ContainerBackground>
    </>
  )
}

EditStudyModule.displayName = "EditStudyModule"

export default withAdmin(EditStudyModule)
