import React, { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"
import CourseGrid from "/components/Dashboard/CourseGrid"
import FilterMenu, { SearchVariables } from "/components/FilterMenu"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import { notEmptyOrEmptyString } from "/util/guards"

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
    search: useQueryParameter("search", false),
    hidden: useQueryParameter("hidden", false),
    handledBy: useQueryParameter("handledBy", false),
    status: useQueryParameter("status", false),
  })

  const [searchVariables, setSearchVariables] = useState<
    typeof initialSearchVariables
  >(initialSearchVariables)

  const {
    loading: editorLoading,
    error: editorError,
    data: editorData,
  } = useQuery(EditorCoursesDocument, {
    variables: searchVariables ?? initialSearchVariables,
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
      searchParams.set(
        "status",
        (searchVariables.status as CourseStatus[]).join(","),
      )
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

  const onClickStatus =
    (value: CourseStatus | null) =>
    (_: React.MouseEvent<Element, MouseEvent>) => {
      setSearchVariables((previousSearchVariables) => ({
        ...previousSearchVariables,
        status: value ? [value] : [],
      }))
    }

  return {
    loading: editorLoading || handlersLoading,
    error: editorError ?? handlersError,
    handlersData,
    editorData,
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
          handlerCourses={handlersData?.handlerCourses ?? []}
          loading={loading}
        />
        <CourseGrid
          courses={editorData?.courses ?? []}
          onClickStatus={onClickStatus}
          loading={loading}
        />
      </WideContainer>
    </Background>
  )
}

const createInitialSearchVariables = ({
  search,
  handledBy,
  hidden,
  status,
}: {
  search?: string
  handledBy?: string
  hidden?: string
  status?: string
}) => {
  const statusParam = (decodeURIComponent(status ?? "")
    ?.split(",")
    .filter(notEmptyOrEmptyString) ?? []) as CourseStatus[]

  const initialSearchVariables: SearchVariables = {
    search,
    hidden: (hidden ?? "").toLowerCase() !== "false" ?? true,
    handledBy: handledBy ?? null,
    status: statusParam.length
      ? statusParam.filter(notEmptyOrEmptyString)
      : [CourseStatus.Active, CourseStatus.Upcoming],
  }

  return initialSearchVariables
}

export default withAdmin(Courses)
