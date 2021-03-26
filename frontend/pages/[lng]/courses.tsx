import React, { useContext, useEffect, useState } from "react"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/client"
import CourseGrid from "/components/Dashboard/CourseGrid"
import { WideContainer } from "/components/Container"
import styled from "@emotion/styled"
import { H1Background } from "/components/Text/headers"
import {
  AllEditorCoursesQuery,
  HandlerCoursesQuery,
} from "/graphql/queries/courses"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"
import LanguageContext from "/contexts/LanguageContext"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useRouter } from "next/router"
import FilterMenu from "/components/FilterMenu"
import { HandlerCourses } from "/static/types/generated/HandlerCourses"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { useTranslator } from "/util/useTranslator"

const Background = styled.section`
  background-color: #61baad;
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: string[] | null
}

const notEmptyOrEmptyString = (value: any) =>
  notEmpty(value) && value !== "" && value !== false

function useCourseSearch() {
  const { language } = useContext(LanguageContext)
  const router = useRouter()

  const statusParam = decodeURIComponent(useQueryParameter("status", false))
    ?.split(",")
    .filter(notEmptyOrEmptyString)

  const initialSearchVariables: SearchVariables = {
    search: useQueryParameter("search", false) || "",
    hidden:
      (useQueryParameter("hidden", false) ?? "").toLowerCase() !== "false" ||
      true,
    handledBy: useQueryParameter("handledBy", false) || null,
    status: statusParam.length ? statusParam : ["Active", "Upcoming"],
  }

  const [searchVariables, setSearchVariables] = useState<SearchVariables>(
    initialSearchVariables,
  )
  const [status, setStatus] = useState<string[]>(
    initialSearchVariables.status ?? [],
  )

  const {
    loading: editorLoading,
    error: editorError,
    data: editorData,
  } = useQuery<AllEditorCourses>(AllEditorCoursesQuery, {
    variables: searchVariables || initialSearchVariables,
  })
  const {
    loading: handlersLoading,
    error: handlersError,
    data: handlersData,
  } = useQuery<HandlerCourses>(HandlerCoursesQuery)

  useEffect(() => {
    const params = [
      ...(["search", "handledBy"] as Array<
        keyof typeof searchVariables
      >).map((field) =>
        notEmptyOrEmptyString(searchVariables[field])
          ? `${field}=${encodeURI(searchVariables[field]?.toString() ?? "")}`
          : "",
      ),
      !searchVariables.hidden ? `hidden=false` : "",
      searchVariables.status?.length &&
      JSON.stringify(searchVariables.status.sort()) !==
        JSON.stringify(["Active", "Upcoming"])
        ? `status=${searchVariables.status.join(",")}`
        : "",
    ].filter(Boolean)

    const query = params.length ? `?${params.join("&")}` : ""
    const as = `/${language}/courses/${query}`
    if (router?.asPath !== as) {
      router.push(as, as, { shallow: true })
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
