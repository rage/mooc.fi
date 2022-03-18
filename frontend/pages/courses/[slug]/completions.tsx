import { ChangeEvent, useState } from "react"

import { WideContainer } from "/components/Container"
import CompletionsList from "/components/Dashboard/CompletionsList"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import LanguageSelector from "/components/Dashboard/LanguageSelector"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import { CourseDetailsFromSlug as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlug"
import CoursesTranslations from "/translations/courses"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { gql, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { TextField } from "@mui/material"

// import useDebounce from "/util/useDebounce"

const ContentArea = styled.div`
  max-width: 39em;
  margin: auto;
`

export const CourseDetailsFromSlugQuery = gql`
  query CompletionCourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
    }
  }
`

const Completions = () => {
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug")
  const router = useRouter()

  const [lng, changeLng] = useState("")
  const [searchString, setSearchString] = useState("")
  const [search, setSearch] = useState("")

  const handleLanguageChange = (event: ChangeEvent<unknown>) => {
    // prevents reloading page, URL changes

    const href = `/courses/${slug}/completions?language=${
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

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label: data?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseCompletions",
      href: `/courses/${slug}/completions`,
    },
  ])
  const title = useSubtitle(data?.course?.name)

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
    <>
      <NextSeo title={title} />
      <CourseLanguageContext.Provider value={lng}>
        <DashboardTabBar slug={slug} selectedValue={1} />

        <WideContainer>
          <H1NoBackground component="h1" variant="h1" align="center">
            {data.course.name}
          </H1NoBackground>
          <SubtitleNoBackground
            component="p"
            variant="subtitle1"
            align="center"
          >
            {t("completions")}
          </SubtitleNoBackground>
          <ContentArea>
            <LanguageSelector
              handleLanguageChange={handleLanguageChange}
              languageValue={lng}
            />
            <TextField
              id="searchString"
              label="Search"
              value={searchString}
              autoComplete="off"
              variant="outlined"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchString(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && setSearch(searchString)}
            />
            <CompletionsList search={search} />
          </ContentArea>
        </WideContainer>
      </CourseLanguageContext.Provider>
    </>
  )
}

Completions.displayName = "Completions"

export default withAdmin(Completions)
