import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"

import { WideContainer } from "/components/Container"
import CourseGrid from "/components/Dashboard/CourseGrid"
import FilterMenu from "/components/FilterMenu"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { FilterContext } from "/contexts/FilterContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import {
  CourseStatus,
  EditorCoursesDocument,
  EditorCoursesQueryVariables,
  HandlerCoursesDocument,
} from "/graphql/generated"

const Background = styled.section`
  background-color: #61baad;
`

const notEmptyOrEmptyString = (value: any): value is string | true | number =>
  notEmpty(value) && value !== "" && value !== false

function useCourseSearch() {
  const router = useRouter()

  const statusParam = useQueryParameter("status", false) ?? []
  const status = (
    Array.isArray(statusParam)
      ? statusParam.filter(notEmptyOrEmptyString)
      : [
          ...decodeURIComponent(statusParam)
            .split(",")
            .filter(notEmptyOrEmptyString),
        ]
  ) as CourseStatus[] // compatibility with old links

  const initialSearchVariables: EditorCoursesQueryVariables = {
    search: useQueryParameter("search", false),
    hidden:
      useQueryParameter("hidden", false).toLowerCase() !== "false" ?? true,
    handledBy: useQueryParameter("handledBy", false) || null,
    status: status.length
      ? status
      : [CourseStatus.Active, CourseStatus.Upcoming],
  }

  const [searchVariables, setSearchVariables] = useState(initialSearchVariables)

  const {
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery(EditorCoursesDocument, {
    variables: searchVariables || initialSearchVariables,
  })
  const {
    loading: handlerCoursesLoading,
    error: handlerCoursesError,
    data: handlerCoursesData,
  } = useQuery(HandlerCoursesDocument)

  useEffect(() => {
    const searchParams = new URLSearchParams()

    if (notEmptyOrEmptyString(searchVariables.search)) {
      searchParams.set("search", encodeURIComponent(searchVariables.search))
    }
    if (notEmptyOrEmptyString(searchVariables.handledBy)) {
      searchParams.set(
        "handledBy",
        encodeURIComponent(searchVariables.handledBy),
      )
    }
    if (!searchVariables.hidden) {
      searchParams.set("hidden", "false")
    }

    // Active and Upcoming is the default status so if it's set, don't add it
    if (
      searchVariables.status?.length &&
      !(
        searchVariables.status.length === 2 &&
        searchVariables.status.includes(CourseStatus.Active) &&
        searchVariables.status.includes(CourseStatus.Upcoming)
      )
    ) {
      ;(searchVariables.status as CourseStatus[])
        .filter(notEmpty)
        .forEach((s) => searchParams.append("status", s))
    }

    const query = searchParams.toString().length
      ? `?${searchParams.toString()}`
      : ""
    const href = `/courses/${query}`

    if (router?.asPath !== href) {
      router.push(href, undefined, { shallow: true })
    }
  }, [searchVariables])

  const onStatusClick = (value: CourseStatus | null) => (_: any) => {
    setSearchVariables({
      ...searchVariables,
      status: value ? [value] : [],
    })
  }

  return {
    loading: coursesLoading || handlerCoursesLoading,
    error: coursesError || handlerCoursesError,
    coursesData,
    handlerCoursesData,
    onStatusClick,
    searchVariables,
    setSearchVariables,
  }
}

function Courses() {
  const t = useTranslator(CoursesTranslations)
  const courseSearch = useCourseSearch()

  useBreadcrumbs([
    {
      translation: "courses",
      href: "/courses",
    },
  ])

  const { error } = courseSearch

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  return (
    <Background>
      <WideContainer>
        <H1Background component="h1" variant="h1" align="center">
          {t("allCourses")}
        </H1Background>
        <FilterContext.Provider value={courseSearch}>
          <FilterMenu />
          <CourseGrid />
        </FilterContext.Provider>
      </WideContainer>
    </Background>
  )
}

export default withAdmin(Courses)
