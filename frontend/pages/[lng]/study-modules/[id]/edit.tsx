import { useContext } from "react"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { SingletonRouter, withRouter } from "next/router"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import { StudyModuleDetails } from "/static/types/generated/StudyModuleDetails"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import LangLink from "/components/LangLink"
import LanguageContext from "/contexes/LanguageContext"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import StudyModulesTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"
import StudyModuleEdit2 from "/components/Dashboard/Editor2/StudyModule"

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

interface EditStudyModuleProps {
  router: SingletonRouter
}

const EditStudyModule = (props: EditStudyModuleProps) => {
  const { router } = props
  const { language } = useContext(LanguageContext)
  const t = useTranslator(StudyModulesTranslations)

  const id = useQueryParameter("id")

  let redirectTimeout: number | null = null

  const { data, loading, error } = useQuery<StudyModuleDetails>(
    StudyModuleQuery,
    {
      variables: { slug: id },
    },
  )

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  const listLink = `${language ? "/" + language : ""}/study-modules`

  if (!loading && !data?.study_module && typeof window !== "undefined") {
    redirectTimeout = setTimeout(
      () => router.push("/[lng]/study-modules", listLink, { shallow: true }),
      5000,
    )
  }
  /*<StudyModuleEdit module={data.study_module} />*/

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("editStudyModule")}
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : data?.study_module ? (
          <StudyModuleEdit2 module={data.study_module} />
        ) : (
          <ErrorContainer elevation={2}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: t("moduleWithIdNotFound", { slug: id }),
              }}
            />
            <Typography variant="body2">
              {t("redirectMessagePre")}
              <LangLink href={listLink}>
                <a
                  onClick={() =>
                    redirectTimeout && clearTimeout(redirectTimeout)
                  }
                  href=""
                >
                  {t("redirectLinkText")}
                </a>
              </LangLink>
              {t("redirectMessagePost")}
            </Typography>
          </ErrorContainer>
        )}
      </WideContainer>
    </section>
  )
}

EditStudyModule.displayName = "EditStudyModule"

export default withRouter(withAdmin(EditStudyModule) as any)
