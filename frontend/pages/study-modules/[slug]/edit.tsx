import { WideContainer } from "/components/Container"
import StudyModuleEdit2 from "/components/Dashboard/Editor2/StudyModule"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1NoBackground } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import { StudyModuleDetails } from "/static/types/generated/StudyModuleDetails"
import StudyModulesTranslations from "/translations/study-modules"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"
import { gql, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const StudyModuleQuery = gql`
  query StudyModuleDetails($slug: String!) {
    study_module(slug: $slug) {
      id
      slug
      name
      image
      order
      courses {
        id
        name
        slug
      }
      study_module_translations {
        id
        name
        language
        description
      }
    }
  }
`

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

const EditStudyModule = () => {
  const router = useRouter()
  const t = useTranslator(StudyModulesTranslations)

  const slug = useQueryParameter("slug")
  const beta = useQueryParameter("beta", false)

  const { data, loading, error } = useQuery<StudyModuleDetails>(
    StudyModuleQuery,
    {
      variables: { slug },
    },
  )

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
        () => router.push(listLink, undefined, { shallow: true }),
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

  const listLink = "/study-modules"

  return (
    <>
      <NextSeo title={title} />
      <section>
        <WideContainer>
          <H1NoBackground component="h1" variant="h1" align="center">
            {t("editStudyModule")}
          </H1NoBackground>
          {loading ? (
            <FormSkeleton />
          ) : data?.study_module ? (
            beta ? (
              <StudyModuleEdit2 module={data.study_module} />
            ) : (
              <StudyModuleEdit module={data.study_module} />
            )
          ) : (
            <ErrorContainer elevation={2}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t("moduleWithIdNotFound", { slug }),
                }}
              />
              <Typography variant="body2">
                {t("redirectMessagePre")}
                <Link href="/study-modules" passHref>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>{t("redirectLinkText")}</a>
                </Link>
                {t("redirectMessagePost")}
              </Typography>
            </ErrorContainer>
          )}
        </WideContainer>
      </section>
    </>
  )
}

EditStudyModule.displayName = "EditStudyModule"

export default withAdmin(EditStudyModule)
