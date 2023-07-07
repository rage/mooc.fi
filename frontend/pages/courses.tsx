import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import CourseGrid from "/components/Dashboard/CourseGrid"
import FilterMenu from "/components/FilterMenu"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { FilterContext, SearchVariables } from "/contexts/FilterContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  CourseStatus,
  EditorCoursesDocument,
  HandlerCoursesDocument,
} from "/graphql/generated"

const Background = styled("section")`
  background-color: #61baad;
`

function useCourseSearch() {
  const router = useRouter()

  useBreadcrumbs([
    {
      translation: "courses",
      href: "/courses",
    },
  ])

  const initialSearchVariables = createInitialSearchVariables({
    search: useQueryParameter("search", { enforce: false }),
    hidden: useQueryParameter("hidden", { enforce: false }),
    handledBy: useQueryParameter("handledBy", { enforce: false }),
    status: useQueryParameter("status", { enforce: false }),
  })

  const [searchVariables, setSearchVariables] = useState<
    typeof initialSearchVariables
  >(initialSearchVariables)

  const {
    loading: coursesLoading,
    error: coursesError,
    data: coursesData,
  } = useQuery(EditorCoursesDocument, {
    variables: searchVariables ?? initialSearchVariables,
  })
  const {
    loading: handlerCoursesLoading,
    error: handlerCoursesError,
    data: handlerCoursesData,
  } = useQuery(HandlerCoursesDocument)

  useEffect(() => {
    const searchParams = new URLSearchParams()

    if (isDefinedAndNotEmpty(searchVariables.search)) {
      searchParams.set("search", encodeURIComponent(searchVariables.search))
    }
    if (isDefinedAndNotEmpty(searchVariables.handledBy)) {
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
      searchVariables.status
        .filter(isDefinedAndNotEmpty)
        .forEach((s) => searchParams.append("status", s))
    }

    const query = searchParams.toString().length
      ? `?${searchParams.toString()}`
      : ""
    const href = `/courses/${query}`

    if (router?.asPath !== href) {
      router.push(href, undefined, { shallow: true })
    }
  }, [
    searchVariables.search,
    searchVariables.handledBy,
    searchVariables.status,
  ])

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

interface CreateInitialSearchVariableArgs {
  search?: string
  handledBy?: string
  hidden?: string
  status?: string
}

const createInitialSearchVariables = ({
  search,
  handledBy,
  hidden,
  status,
}: CreateInitialSearchVariableArgs): SearchVariables => {
  const statusParam = (decodeURIComponent(status ?? "")
    ?.split(",")
    .filter(isDefinedAndNotEmpty) ?? []) as CourseStatus[]

  const initialSearchVariables = {
    search,
    hidden: (hidden ?? "").toLowerCase() !== "false" ?? true,
    handledBy: handledBy ?? null,
    status: statusParam.length
      ? statusParam.filter(isDefinedAndNotEmpty)
      : [CourseStatus.Active, CourseStatus.Upcoming],
  }

  return initialSearchVariables
}

export default withAdmin(Courses)
