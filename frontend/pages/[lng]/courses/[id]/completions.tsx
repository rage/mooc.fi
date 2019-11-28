import React, { useContext, useState } from "react"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { NextPageContext as NextContext } from "next"
import AdminError from "/components/Dashboard/AdminError"
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
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useQueryParameter } from "/util/useQueryParameter"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
export const CourseDetailsFromSlugQuery = gql`
  query CompletionCourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

interface CompletionsProps {
  admin: boolean
  router: SingletonRouter
}

const Completions = (props: CompletionsProps) => {
  const { admin, router } = props
  const { language } = useContext(LanguageContext)
  const [lng, changeLng] = useState(
    (router?.query?.language as string) ??
      mapNextLanguageToLocaleCode(language as string) ??
      "",
  )

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
      variables: { slug: slug },
    },
  )

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <Spinner />
  }

  if (error) {
    return <ModifiableErrorMessage ErrorMessage={JSON.stringify(error)} />
  }

  if (!data.course) {
    return (
      <>
        <p>Course not found. Go back?</p>
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
          Completions
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

Completions.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)

  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default withRouter(Completions)
