import React, { useCallback, useContext, useEffect } from "react"
import gql from "graphql-tag"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import { useTheme } from "@material-ui/core/styles"
import { TextField, IconButton, useMediaQuery } from "@material-ui/core"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
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

const StyledForm = styled.form`
  display: flex;
  width: 100%;
`

const StyledFooter = styled.footer`
  flex-shrink: 0;
  margin-left: 2.5;
`

const StyledButton = styled(ButtonWithPaddingAndMargin)`
  color: white;
`

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ) => void
  data: UserDetailsContains
  setPage: Function
  loadData: Function
  searchText: string
  updateRoute: (_: string, __: number, ___: number) => void
  setSearchVariables: React.Dispatch<React.SetStateAction<any>>
}

const StyledErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 3px;
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  line-height: 1.66;
`

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const {
    data,
    page,
    rowsPerPage,
    setPage,
    searchText,
    /*loadData, */ updateRoute,
    setSearchVariables,
  } = props

  const startCursor = data?.userDetailsContains?.pageInfo?.startCursor
  const endCursor = data?.userDetailsContains?.pageInfo?.endCursor
  const count = data?.userDetailsContains?.count ?? 0

  const handleFirstPageButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchText,
        first: rowsPerPage,
      })
      setPage(0)
      /*       loadData({
        variables: { search: searchText, first: rowsPerPage },
      }) */
      updateRoute(searchText, rowsPerPage, 0)
    },
    [],
  )

  const handleBackButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchText,
        last: rowsPerPage,
        before: startCursor,
      })
      setPage(page - 1)
      /* 
      loadData({
        variables: {
          search: searchText,
          last: rowsPerPage,
          before: startCursor, // cursor.before,
        },
      })
 */ updateRoute(
        searchText,
        rowsPerPage,
        page - 1,
      )
    },
    [],
  )

  const handleNextButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchText,
        first: rowsPerPage,
        after: endCursor,
      })
      setPage(page + 1)
      /*       loadData({
        variables: {
          search: searchText,
          first: rowsPerPage,
          after: endCursor, // cursor.after,
        },
      }) */
      // setCount(data.userDetailsContains.count)
      updateRoute(searchText, rowsPerPage, page + 1)
    },
    [],
  )

  const handleLastPageButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchText,
        last: rowsPerPage - (rowsPerPage - (count % rowsPerPage)),
      })
      setPage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))
      /*       loadData({
        variables: {
          search: searchText,
          last: rowsPerPage - (rowsPerPage - (count % rowsPerPage)),
        },
      }) */
      updateRoute(
        searchText,
        rowsPerPage,
        Math.max(0, Math.ceil(count / rowsPerPage) - 1),
      )
    },
    [],
  )

  return (
    <StyledFooter>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </StyledFooter>
  )
}

// @ts-ignore: asdf
interface Search {
  text: string
  page: number
  rowsPerPage: number
}

const UserSearch = () => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)
  const router = useRouter()
  const textParam = useQueryParameter("text", false)
  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10

  const [searchVariables, setSearchVariables] = React.useState({
    search: textParam,
    first: pageParam === 0 ? rowsParam : undefined,
    skip: pageParam > 0 ? (pageParam - 1) * rowsParam : undefined,
  })

  const [searchText, setSearchText] = React.useState(textParam)
  const [page, setPage] = React.useState(pageParam)
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsParam)
  // @ts-ignore: k
  const [error, setError] = React.useState("")

  const [loadData, { data, loading }] = useLazyQuery(GET_DATA, { ssr: false })

  const isMobile = useMediaQuery("(max-width:800px)", { noSsr: true })

  const GridComponent = isMobile ? MobileGrid : WideGrid

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value as string)
  }
  interface HandleChangeRowsPerPageProps {
    eventValue: string
  }

  useEffect(() => {
    if (searchVariables.search !== "") {
      loadData({
        variables: searchVariables,
      })
    }
  }, [searchVariables])

  // @ts-ignore: text
  const updateRoute = useCallback(
    (text, rows, page) => {
      const params = [
        rows !== 10 ? `rowsPerPage=${rows}` : "",
        page > 0 ? `page=${page}` : "",
      ].filter(v => !!v)
      const query = params.length ? `?${params.join("&")}` : ""

      if (text !== "") {
        router.push(
          "/[lng]/users/search/[text]",
          `/${language}/users/search/${text}${query}`,
        )
      } else {
        router.push("/[lng]/users/search", `/${language}/users/search${query}`)
      }
    },
    [searchText, rowsPerPage],
  )

  const handleSubmit = useCallback(() => {
    if (searchText !== "") {
      setSearchVariables({
        ...searchVariables,
        search: searchText,
      })
      updateRoute(searchText, rowsPerPage, page)
    }
  }, [searchText, rowsPerPage])

  const handleChangeRowsPerPage = useCallback(
    async (props: HandleChangeRowsPerPageProps) => {
      const { eventValue } = props
      const newRowsPerPage = parseInt(eventValue, 10)

      if (searchText !== "") {
        setSearchVariables({
          ...searchVariables,
          search: searchText,
        })
      }
      setPage(0)
      setRowsPerPage(newRowsPerPage)
      updateRoute(searchText, newRowsPerPage, page)
    },
    [searchText],
  )

  return (
    <>
      <Container>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("userSearch")}
        </H1NoBackground>
        <div>
          <StyledForm
            onSubmit={async (event: any) => {
              event.preventDefault()
              handleSubmit()
              /*               loadData({
                              variables: { search: searchText, first: rowsPerPage },
                            }) */
              /*updateRoute(searchText, rowsPerPage)
              setPage(0)*/
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
                /*                 loadData({
                                  variables: { search: searchText, first: rowsPerPage },
                                }) */
                /*                 updateRoute(searchText, rowsPerPage)
                setPage(0) */
              }}
            >
              {t("search")}
            </StyledButton>
          </StyledForm>
          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
          <GridComponent
            data={data}
            loading={loading}
            loadData={loadData}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            TablePaginationActions={TablePaginationActions}
            page={page}
            rowsPerPage={rowsPerPage}
            searchText={searchText}
            setPage={setPage}
            updateRoute={updateRoute}
            setSearchVariables={setSearchVariables}
          />
        </div>
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
