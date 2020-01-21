import React, { useCallback, useContext } from "react"
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
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { data, page, rowsPerPage, setPage, searchText, loadData } = props

  const startCursor = data?.userDetailsContains?.pageInfo?.startCursor
  const endCursor = data?.userDetailsContains?.pageInfo?.endCursor
  const count = data?.userDetailsContains?.count ?? 0

  const handleFirstPageButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      loadData({
        variables: { search: searchText, first: rowsPerPage },
      })
      setPage(0)
    },
    [],
  )

  const handleBackButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      loadData({
        variables: {
          search: searchText,
          last: rowsPerPage,
          before: startCursor, // cursor.before,
        },
      })
      setPage(page - 1)
    },
    [],
  )

  const handleNextButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      loadData({
        variables: {
          search: searchText,
          first: rowsPerPage,
          after: endCursor, // cursor.after,
        },
      })
      // setCount(data.userDetailsContains.count)
      setPage(page + 1)
    },
    [],
  )

  const handleLastPageButtonClick = useCallback(
    async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      loadData({
        variables: {
          search: searchText,
          last: rowsPerPage - (rowsPerPage - (count % rowsPerPage)),
        },
      })
      setPage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))
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

const UserSearch = () => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)

  const [searchText, setSearchText] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [loadData, { data, loading }] = useLazyQuery(GET_DATA, { ssr: false })

  const isMobile = useMediaQuery("(max-width:800px)", { noSsr: true })

  const GridComponent = isMobile ? MobileGrid : WideGrid

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value as string)
  }
  interface HandleChangeRowsPerPageProps {
    eventValue: string
  }
  const handleChangeRowsPerPage = useCallback(
    async (props: HandleChangeRowsPerPageProps) => {
      const { eventValue } = props
      if (searchText !== "") {
        loadData({
          variables: { search: searchText, first: parseInt(eventValue, 10) },
        })
      }
      setPage(0)
      setRowsPerPage(parseInt(eventValue, 10))
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
              loadData({
                variables: { search: searchText, first: rowsPerPage },
              })
              setPage(0)
            }}
          >
            <TextField
              id="standard-search"
              label={t("searchByString")}
              type="search"
              margin="normal"
              autoComplete="off"
              onChange={onTextBoxChange}
            />

            <StyledButton
              variant="contained"
              onClick={async (event: any) => {
                event.preventDefault()
                loadData({
                  variables: { search: searchText, first: rowsPerPage },
                })
                setPage(0)
              }}
            >
              {t("search")}
            </StyledButton>
          </StyledForm>
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
  ) {
    userDetailsContains(
      search: $search
      first: $first
      last: $last
      after: $after
      before: $before
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
