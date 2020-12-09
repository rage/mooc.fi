import React, { useContext, useEffect, useState } from "react"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/client"
import CourseGrid from "/components/Dashboard/CourseGrid"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import { H1Background } from "/components/Text/headers"
import {
  AllEditorCoursesQuery,
  HandlerCoursesQuery,
} from "/graphql/queries/courses"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useRouter } from "next/router"
import FilterMenu from "/components/FilterMenu"
import { HandlerCourses } from "/static/types/generated/HandlerCourses"

const Background = styled.section`
  background-color: #61baad;
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
}

const notEmptyOrEmptyString = (value: any) =>
  notEmpty(value) && value !== "" && value !== false

function Courses() {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const router = useRouter()

  const searchParam = useQueryParameter("search", false)
  const hiddenParam =
    (useQueryParameter("hidden", false) ?? "").toLowerCase() === "true" || null
  const handledByParam = useQueryParameter("handledBy", false) || null

  const initialSearchVariables: SearchVariables = {
    search: searchParam || "",
    hidden: hiddenParam || null,
    handledBy: handledByParam || null,
  }

  const [searchVariables, setSearchVariables] = useState<SearchVariables>(
    initialSearchVariables,
  )

  const { loading, error, data } = useQuery<AllEditorCourses>(
    AllEditorCoursesQuery,
    {
      variables: searchVariables || initialSearchVariables,
    },
  )
  const {
    loading: handlersLoading,
    error: handlersError,
    data: handlersData,
  } = useQuery<HandlerCourses>(HandlerCoursesQuery)

  useEffect(() => {
    const params = (Object.keys(searchVariables) as Array<
      keyof typeof searchVariables
    >)
      .map((field) =>
        notEmptyOrEmptyString(searchVariables[field])
          ? `${field}=${encodeURI(searchVariables[field]?.toString() ?? "")}`
          : "",
      )
      .filter(Boolean)

    const query = params.length ? `?${params.join("&")}` : ""
    const as = `/${language}/courses/${query}`
    if (router?.asPath !== as) {
      router.push(as, as, { shallow: true })
    }
  }, [searchVariables])

  if (error || handlersError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error || handlersError, undefined, 2)}
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
          initialSearchString={searchParam}
          initialHidden={hiddenParam}
          initialHandledBy={handledByParam}
          handlerCourses={handlersData?.handlerCourses?.filter(notEmpty) ?? []}
          disabled={loading || handlersLoading}
        />
        <CourseGrid
          courses={data?.courses?.filter(notEmpty)}
          loading={loading}
        />
      </WideContainer>
    </Background>
  )
}

export default withAdmin(Courses)
