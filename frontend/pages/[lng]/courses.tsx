import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/client"
import CourseGrid from "/components/Dashboard/CourseGrid"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import { H1Background } from "/components/Text/headers"
import { AllEditorCoursesQuery } from "/graphql/queries/courses"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import notEmpty from "/util/notEmpty"
import { InputAdornment, TextField, IconButton } from "@material-ui/core"
import { useQueryParameter } from "/util/useQueryParameter"
import { Clear } from "@material-ui/icons"
import { useRouter } from "next/router"

const Background = styled.section`
  background-color: #61baad;
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
}

function Courses() {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const router = useRouter()

  const searchParam = useQueryParameter("search", false)
  const hiddenParam = Boolean(useQueryParameter("hidden", false)) || null
  const handledByParam = useQueryParameter("handled_by", false) || null

  const [searchString, setSearchString] = useState(searchParam)
  const [searchVariables, setSearchVariables] = useState<SearchVariables>({
    search: searchParam || "",
    hidden: hiddenParam || null,
    handledBy: handledByParam || null,
  })

  const { loading, error, data } = useQuery<AllEditorCourses>(
    AllEditorCoursesQuery,
    {
      variables: searchVariables,
      ssr: false,
    },
  )

  useEffect(() => {
    const params = [
      notEmpty(searchVariables.search) && searchVariables.search !== ""
        ? `search=${searchVariables.search}`
        : "",
      notEmpty(searchVariables.hidden)
        ? `hidden=${searchVariables.hidden}`
        : "",
      notEmpty(searchVariables.handledBy)
        ? `handledBy=${searchVariables.handledBy}`
        : "",
    ].filter(Boolean)
    const query = params.length ? `?${params.join("&")}` : ""
    const as = `/${language}/courses/${query}`
    if (router?.asPath !== as) {
      router.push(as, as, { shallow: true })
    }
  }, [searchVariables])
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
        <TextField
          id="searchString"
          label="Search"
          value={searchString}
          autoComplete="off"
          variant="outlined"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            setSearchVariables({
              ...searchVariables,
              search: searchString,
            })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearchString("")
                    setSearchVariables({
                      ...searchVariables,
                      search: "",
                    })
                  }}
                  disabled={searchString === ""}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
