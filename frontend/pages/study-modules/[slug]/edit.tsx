import { useEffect } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import StudyModuleEdit2 from "../../../components/Dashboard/Editor/StudyModule"
import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import StudyModuleEdit from "../../../components/Dashboard/EditorLegacy/StudyModule"
import { WideContainer } from "/components/Container"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import { EditorStudyModuleDetailsDocument } from "/graphql/generated"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`

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
  const title = useSubtitle(data?.study_module?.name)

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
          {!loading &&
            data?.study_module &&
            (legacy ? (
              <StudyModuleEdit module={data.study_module} />
            ) : (
              <StudyModuleEdit2 module={data.study_module} />
            ))}
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
