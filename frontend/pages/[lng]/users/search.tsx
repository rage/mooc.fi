import React, { useCallback } from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import { useTheme } from "@material-ui/core/styles"
import { Button, TextField, IconButton, useMediaQuery } from "@material-ui/core"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import Container from "/components/Container"
import styled from "styled-components"
import { NextPageContext as NextContext } from "next"
import { isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { isSignedIn } from "/lib/authentication"
import AdminError from "/components/Dashboard/AdminError"
import { useLazyQuery } from "@apollo/react-hooks"
import WideGrid from "/components/Dashboard/Users/WideGrid"
import MobileGrid from "/components/Dashboard/Users/MobileGrid"
import { HOneNoBackground } from "/components/Text/headers"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  admin: boolean
}

const StyledForm = styled.form`
  display: flex;
  width: 100%;
  flex-wrap: "wrap";
`

const StyledFooter = styled.footer`
  flex-shrink: 0;
  margin-left: 2.5;
`

const StyledButton = styled(Button)`
  margin-top: 14px;
  margin-bottom: 7px;
`
const StyledTextField = styled(TextField)`
  margin-left: 1;
  margin-right: 1;
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

  const startCursor =
    data &&
    data.userDetailsContains &&
    data.userDetailsContains.pageInfo &&
    data.userDetailsContains.pageInfo.startCursor
  const endCursor =
    data &&
    data.userDetailsContains &&
    data.userDetailsContains.pageInfo &&
    data.userDetailsContains.pageInfo.endCursor
  const count =
    (data && data.userDetailsContains && data.userDetailsContains.count) || 0

  const handleFirstPageButtonClick = useCallback(async (
    // @ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    loadData({
      variables: { search: searchText, first: rowsPerPage },
    })
    setPage(0)
  }, [])

  const handleBackButtonClick = useCallback(async (
    // @ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    loadData({
      variables: {
        search: searchText,
        last: rowsPerPage,
        before: startCursor, // cursor.before,
      },
    })
    setPage(page - 1)
  }, [])

  const handleNextButtonClick = useCallback(async (
    // @ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    loadData({
      variables: {
        search: searchText,
        first: rowsPerPage,
        after: endCursor, // cursor.after,
      },
    })
    // setCount(data.userDetailsContains.count)
    setPage(page + 1)
  }, [])

  const handleLastPageButtonClick = useCallback(async (
    // @ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    loadData({
      variables: {
        search: searchText,
        last: rowsPerPage - (rowsPerPage - (count % rowsPerPage)),
      },
    })
    setPage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }, [])

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

const UserSearch = (props: UserSearchProps) => {
  const [searchText, setSearchText] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [loadData, { data, loading }] = useLazyQuery(GET_DATA)

  const isMobile = useMediaQuery("(max-width:800px)")
  const GridComponent = isMobile ? MobileGrid : WideGrid

  if (!props.admin) {
    return <AdminError />
  }

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
        <HOneNoBackground component="h1" variant="h1" align="center">
          User Search
        </HOneNoBackground>
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
            <StyledTextField
              id="standard-search"
              label="Search by string"
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
              Search
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

UserSearch.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default UserSearch
