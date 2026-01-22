import { ChangeEvent, useCallback, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import CompletionsDownloadButton from "/components/CompletionsDownloadButton"
import { WideContainer } from "/components/Container"
import CompletionsList from "/components/Dashboard/CompletionsList"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import LanguageSelector from "/components/Dashboard/LanguageSelector"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import Spinner from "/components/Spinner"
import { H1NoBackground, SubtitleNoBackground } from "/components/Text/headers"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

import { CourseFromSlugDocument } from "/graphql/generated"

// import useDebounce from "/hooks/useDebounce"

const ContentArea = styled("div")`
  max-width: 39em;
  margin: auto;
`

const TitleContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  max-width: 60em;
  margin-left: auto;
  margin-right: auto;

  & h1 {
    flex-shrink: 1;
    min-width: 0;
  }

  & button {
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;

    & h1 {
      width: 100%;
    }

    & button {
      align-self: flex-start;
    }
  }
`

const Completions = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug")
  const router = useRouter()

  const [lng, changeLng] = useState("")
  const [searchString, setSearchString] = useState("")
  const [search, setSearch] = useState("")

  const handleLanguageChange = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // prevents reloading page, URL changes

      const href = `${baseUrl}/courses/${slug}/completions?language=${e.target.value}`
      changeLng(e.target.value)
      router.replace(router.pathname, href, { shallow: true })
    },
  )

  const handleSearchChange = useEventCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value)
    },
  )
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setSearch(searchString)
      }
    },
    [searchString],
  )

  const { data, loading, error } = useQuery(CourseFromSlugDocument, {
    variables: { slug },
  })

  useBreadcrumbs([
    {
      translation: "courses",
      href: `${baseUrl}/courses`,
    },
    {
      label: data?.course?.name,
      href: `${baseUrl}/courses/${slug}`,
    },
    {
      translation: "courseCompletions",
      href: `${baseUrl}/courses/${slug}/completions`,
    },
  ])
  const title = data?.course?.name ?? "..."

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
          <TitleContainer>
            <H1NoBackground component="h1" variant="h1">
              {data.course.name}
            </H1NoBackground>
            <CompletionsDownloadButton courseId={data.course.id} />
          </TitleContainer>
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
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
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
