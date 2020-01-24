import React, { useContext, useState } from "react"
import CompletionsList from "/components/Dashboard/CompletionsList"
import { WideContainer } from "/components/Container"
import CourseLanguageContext from "/contexes/CourseLanguageContext"
import LanguageContext from "/contexes/LanguageContext"
import LanguageSelector from "/components/Dashboard/LanguageSelector"
import { withRouter, SingletonRouter } from "next/router"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import { useQuery } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslations from "/translations/courses"

export const CourseDetailsFromSlugQuery = gql`
  query CompletionCourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Completions = ({ router }: { router: SingletonRouter }) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslations(language)

  const [lng, changeLng] = useState("")

  const slug = useQueryParameter("id")

  const handleLanguageChange = (event: React.ChangeEvent<unknown>) => {
    // prevents reloading page, URL changes

    const href = `/${language}/courses/${slug}/completions?language=${
      (event.target as HTMLInputElement).value
    }`
    changeLng((event.target as HTMLInputElement).value as string)
    router.replace(router.pathname, href, { shallow: true })
  }

  const { data, loading, error } = useQuery<CourseDetailsData>(
    CourseDetailsFromSlugQuery,
    {
      variables: { slug },
    },
  )

  if (loading || !data) {
    return <Spinner />
  }

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  if (!data.course) {
    return (
      <>
        <p>{t("courseNotFound")}</p>
      </>
    )
  }
  return (
    <CourseLanguageContext.Provider value={lng}>
      <DashboardTabBar slug={slug} selectedValue={1} />

      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {data.course.name}
        </H1NoBackground>
        <SubtitleNoBackground component="p" variant="subtitle1" align="center">
          {t("completions")}
        </SubtitleNoBackground>
        <LanguageSelector
          handleLanguageChange={handleLanguageChange}
          languageValue={lng}
        />
        <CompletionsList />
      </WideContainer>
    </CourseLanguageContext.Provider>
  )
}

Completions.displayName = "Completions"

export default withRouter(withAdmin(Completions) as any)
