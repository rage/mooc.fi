import React, { useCallback } from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import {
  UserDetailsContains,
  UserDetailsContains_userDetailsContains_edges,
} from "/static/types/generated/UserDetailsContains"
import { useTheme } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableFooter from "@material-ui/core/TableFooter"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import Container from "/components/Container"
import { TableHead, Typography } from "@material-ui/core"
import styled from "styled-components"
import { NextPageContext as NextContext } from "next"
import { isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { isSignedIn } from "/lib/authentication"
import AdminError from "/components/Dashboard/AdminError"
import { useLazyQuery } from "@apollo/react-hooks"
import Skeleton from "@material-ui/lab/Skeleton"
import range from "lodash/range"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  admin: boolean
}

const TableWrapper = styled.div`
  overflow-x: "auto";
`

const StyledTableCell = styled(TableCell)`
  background-color: black;
  color: white;
`

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

const StyledPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
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
    data.userDetailsContains.pageInfo.startCursor
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
        last: rowsPerPage,
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

  if (!props.admin) {
    return <AdminError />
  }

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value)
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
        setPage(0)
      } else setPage(0)
      setRowsPerPage(parseInt(eventValue, 10))
    },
    [],
  )

  return (
    <Container>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
      >
        User Search
      </Typography>
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

        <StyledPaper>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell align="right">upstream_id</StyledTableCell>
                  <StyledTableCell align="right">First Name</StyledTableCell>
                  <StyledTableCell align="right">Last Name</StyledTableCell>
                  <StyledTableCell align="right">
                    Student Number
                  </StyledTableCell>
                  <StyledTableCell align="right">Completions</StyledTableCell>
                </TableRow>
              </TableHead>
              <RenderResults
                data={
                  (data &&
                    data.userDetailsContains &&
                    data.userDetailsContains.edges) ||
                  []
                }
                loading={loading}
              />
              <TableFooter>
                <TableRow>
                  <td align="left">
                    <TablePagination
                      rowsPerPageOptions={[10, 20, 50]}
                      colSpan={3}
                      count={
                        data && data.userDetailsContains
                          ? data.userDetailsContains.count
                          : 0
                      }
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={() => null}
                      onChangeRowsPerPage={(
                        event: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >,
                      ) => {
                        const eventValue = event.target.value
                        let newProps: HandleChangeRowsPerPageProps = {
                          eventValue,
                        }
                        return handleChangeRowsPerPage(newProps)
                      }}
                      ActionsComponent={props => {
                        const newProps: TablePaginationActionsProps = {
                          ...props,
                          setPage,
                          searchText,
                          loadData,
                          data,
                        }
                        return TablePaginationActions(newProps)
                      }}
                    />
                  </td>
                </TableRow>
              </TableFooter>
            </Table>
          </TableWrapper>
        </StyledPaper>
      </div>
    </Container>
  )
}
interface RenderResultsProps {
  data: UserDetailsContains_userDetailsContains_edges[]
  loading: boolean
}
const RenderResults = (props: RenderResultsProps) => {
  const { data, loading } = props

  if (loading) {
    return (
      <TableBody>
        {range(5).map(_ => (
          <TableRow>
            <TableCell colSpan={5}>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  if (!data || (data && data.length < 1))
    return (
      <TableBody>
        <TableRow>
          <TableCell>Not Found</TableCell>
        </TableRow>
      </TableBody>
    )
  return (
    <TableBody>
      {data.map(row => (
        <TableRow key={row.node.upstream_id}>
          <TableCell component="th" scope="row">
            {row.node.email}
          </TableCell>
          <TableCell align="right">{row.node.upstream_id}</TableCell>
          <TableCell align="right">{row.node.first_name}</TableCell>
          <TableCell align="right">{row.node.last_name}</TableCell>
          <TableCell align="right">{row.node.student_number}</TableCell>
          <TableCell align="right">
            {/* FIXME: this should be a next link */}
            <Button
              variant="contained"
              href={row.node.upstream_id + "/completions"}
            >
              Completions
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
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
