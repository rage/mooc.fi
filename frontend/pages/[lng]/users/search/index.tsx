import React, { useCallback, useContext, useEffect, useState } from "react"
import gql from "graphql-tag"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import { TextField, useMediaQuery } from "@material-ui/core"
import Container from "/components/Container"
import styled from "styled-components"
import { useLazyQuery } from "@apollo/react-hooks"
import WideGrid from "/components/Dashboard/Users/WideGrid"
import MobileGrid from "/components/Dashboard/Users/MobileGrid"
import { H1NoBackground } from "/components/Text/headers"
import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import withAdmin from "/lib/with-admin"
import getUsersTranslator from "/translations/users"
import LanguageContext from "/contexes/LanguageContext"
import { useQueryParameter } from "/util/useQueryParameter"
import { useRouter } from "next/router"
import UserSearchContext from "/contexes/UserSearchContext"

const StyledForm = styled.form`
  display: flex;
  width: 100%;
`

const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
`

const UserSearch = () => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)
  const router = useRouter()
  const textParam = useQueryParameter("text", false)

  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10

  const [searchVariables, setSearchVariables] = useState({
    search: textParam,
    first: rowsParam,
    skip: pageParam > 0 ? (pageParam - 1) * rowsParam : undefined,
  })

  const [searchText, setSearchText] = useState(textParam)
  const [page, setPage] = useState(pageParam)
  const [rowsPerPage, setRowsPerPage] = useState(rowsParam)

  const [loadData, { data, loading }] = useLazyQuery<UserDetailsContains>(
    GET_DATA,
    { ssr: false },
  )

  const isMobile = useMediaQuery("(max-width:800px)", { noSsr: true })

  const GridComponent = isMobile ? MobileGrid : WideGrid

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value as string)
  }

  useEffect(() => {
    if (searchVariables.search !== "") {
      loadData({
        variables: searchVariables,
      })
    }
  }, [searchVariables])

  useEffect(() => {
    const params = [
      rowsPerPage !== 10 ? `rowsPerPage=${rowsPerPage}` : "",
      page > 0 ? `page=${page}` : "",
    ].filter(v => !!v)
    const query = params.length ? `?${params.join("&")}` : ""

    if (searchText !== "") {
      router.push(
        "/[lng]/users/search/[text]",
        `/${language}/users/search/${searchText}${query}`,
      )
    } else {
      router.push("/[lng]/users/search", `/${language}/users/search${query}`)
    }
  }, [searchVariables.search, rowsPerPage, page])

  const handleSubmit = useCallback(() => {
    if (searchText !== "") {
      setSearchVariables({
        ...searchVariables,
        search: searchText,
      })
    }
  }, [searchText, rowsPerPage])

  const handleChangeRowsPerPage = useCallback(
    async ({ eventValue }: { eventValue: string }) => {
      const newRowsPerPage = parseInt(eventValue, 10)

      setSearchVariables({
        ...searchVariables,
        first: newRowsPerPage,
      })
      setPage(0)
      setRowsPerPage(newRowsPerPage)
    },
    [searchText],
  )

  return (
    <>
      <Container>
        <UserSearchContext.Provider
          value={{
            data: data || ({} as UserDetailsContains),
            loading,
            loadData,
            handleChangeRowsPerPage,
            page,
            rowsPerPage,
            searchText,
            setPage,
            setSearchVariables,
          }}
        >
          <H1NoBackground component="h1" variant="h1" align="center">
            {t("userSearch")}
          </H1NoBackground>
          <div>
            <StyledForm
              onSubmit={async (event: any) => {
                event.preventDefault()
                handleSubmit()
              }}
            >
              <TextField
                id="standard-search"
                label={t("searchByString")}
                type="search"
                margin="normal"
                autoComplete="off"
                value={searchText}
                onChange={onTextBoxChange}
              />

              <StyledButton
                variant="contained"
                disabled={searchText === ""}
                onClick={async (event: any) => {
                  event.preventDefault()
                  handleSubmit()
                }}
              >
                {t("search")}
              </StyledButton>
            </StyledForm>
            <GridComponent />
          </div>
        </UserSearchContext.Provider>
      </Container>
    </>
  )
}

const GET_DATA = gql`
  query UserDetailsContains(
    $search: String!
    $before: ID
    $after: ID
    $first: Int
    $last: Int
    $skip: Int
  ) {
    userDetailsContains(
      search: $search
      first: $first
      last: $last
      after: $after
      before: $before
      skip: $skip
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          email
          student_number
          real_student_number
          upstream_id
          first_name
          last_name
        }
      }
      count(search: $search)
    }
  }
`

export default withAdmin(UserSearch)
