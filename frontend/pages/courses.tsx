import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"

import { WideContainer } from "/components/Container"
import CourseGrid from "/components/Dashboard/CourseGrid"
import FilterMenu from "/components/FilterMenu"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import {
  CourseStatus,
  EditorCoursesDocument,
  HandlerCoursesDocument,
} from "/graphql/generated"

const Background = styled.section`
  background-color: #61baad;
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: CourseStatus[] | null
}

const notEmptyOrEmptyString = (value: any): value is string | true | number =>
  notEmpty(value) && value !== "" && value !== false

function useCourseSearch() {
  const router = useRouter()

  useBreadcrumbs([
    {
      translation: "courses",
      href: "/courses",
    },
  ])

  const statusParam = (decodeURIComponent(useQueryParameter("status", false))
    ?.split(",")
    .filter(notEmptyOrEmptyString) ?? []) as CourseStatus[]

  const initialSearchVariables: SearchVariables = {
    search: useQueryParameter("search", false) || "",
    hidden:
      (useQueryParameter("hidden", false) ?? "").toLowerCase() !== "false" ||
      true,
    handledBy: useQueryParameter("handledBy", false) || null,
    status: statusParam.length
      ? statusParam
      : [CourseStatus.Active, CourseStatus.Upcoming],
  }

  const [searchVariables, setSearchVariables] = useState<SearchVariables>(
    initialSearchVariables,
  )
  const [status, setStatus] = useState<CourseStatus[]>(
    initialSearchVariables.status ?? [],
  )

  const {
    loading: editorLoading,
    error: editorError,
    data: editorData,
  } = useQuery(EditorCoursesDocument, {
    variables: searchVariables || initialSearchVariables,
  })
  const {
    loading: handlersLoading,
    error: handlersError,
    data: handlersData,
  } = useQuery(HandlerCoursesDocument)

  useEffect(() => {
    const searchParams = new URLSearchParams()

    if (notEmptyOrEmptyString(searchVariables.search)) {
      searchParams.set(
        "search",
        encodeURIComponent(searchVariables.search.toString() ?? ""),
      )
    }
    if (notEmptyOrEmptyString(searchVariables.handledBy)) {
      searchParams.set(
        "handledBy",
        encodeURIComponent(searchVariables.handledBy.toString() ?? ""),
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
      searchParams.set("status", searchVariables.status.join(","))
    }

    const query = searchParams.toString().length
      ? `?${searchParams.toString()}`
      : ""
    const href = `/courses/${query}`

    if (router?.asPath !== href) {
      router.push(href, undefined, { shallow: true })
    }
  }, [searchVariables])

  const onClickStatus = (value: CourseStatus | null) => (_: any) => {
    setStatus(value ? [value] : [])
    setSearchVariables({
      ...searchVariables,
      status: value ? [value] : [],
    })
  }

  return {
    loading: editorLoading || handlersLoading,
    error: editorError || handlersError,
    handlersData,
    editorData,
    status,
    setStatus,
    onClickStatus,
    searchVariables,
    setSearchVariables,
  }
}

function Courses() {
  const t = useTranslator(CoursesTranslations)
  const {
    loading,
    error,
    handlersData,
    editorData,
    status,
    setStatus,
    onClickStatus,
    searchVariables,
    setSearchVariables,
  } = useCourseSearch()

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
        <FilterMenu
          searchVariables={searchVariables}
          setSearchVariables={setSearchVariables}
          status={status}
          setStatus={setStatus}
          handlerCourses={handlersData?.handlerCourses?.filter(notEmpty) ?? []}
          loading={loading}
        />
        <CourseGrid
          courses={editorData?.courses?.filter(notEmpty)}
          onClickStatus={onClickStatus}
          loading={loading}
        />
      </WideContainer>
    </Background>
  )
}

export default withAdmin(Courses)
