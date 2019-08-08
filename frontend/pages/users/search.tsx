import * as React from "react"
import { SingletonRouter } from "next/router"
import gql from "graphql-tag"
import { ApolloConsumer } from "react-apollo"
import {
  UserEmailContains,
  UserEmailContains_userEmailContains_edges,
} from "../../static/types/generated/UserEmailContains"
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
import { ApolloClient } from "apollo-boost"
import Container from "../../components/Container"
import { TableHead, Typography } from "@material-ui/core"
import styled from "styled-components"
import { NextPageContext as NextContext } from "next"
import { isAdmin } from "../../lib/authentication"
import redirect from "../../lib/redirect"
import { isSignedIn } from "../../lib/authentication"
import AdminError from "../../components/Dashboard/AdminError"

interface UserSearchProps {
  namespacesRequired: string[]
  router: SingletonRouter
  t: Function
  i18n: any
  tReady: boolean
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
  client: ApolloClient<any>
  setCount: Function
  setResult: Function
  setCursor: Function
  setPage: Function
  searchText: string
  cursor: any
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const {
    count,
    page,
    rowsPerPage,
    client,
    setCount,
    setResult,
    setCursor,
    setPage,
    searchText,
    cursor,
  } = props

  async function handleFirstPageButtonClick(
    //@ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    const { data } = await client.query({
      query: GET_DATA,
      variables: { email: searchText, first: rowsPerPage },
    })
    saveState(setResult, data, setCursor, setPage, 0, setCount)
  }

  async function handleBackButtonClick(
    //@ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    const { data } = await client.query({
      query: GET_DATA,
      variables: {
        email: searchText,
        last: rowsPerPage,
        before: cursor.before,
      },
    })
    saveState(setResult, data, setCursor, setPage, page - 1, setCount)
  }

  async function handleNextButtonClick(
    //@ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    const { data } = await client.query({
      query: GET_DATA,
      variables: {
        email: searchText,
        first: rowsPerPage,
        after: cursor.after,
      },
    })
    setCount(data.userEmailContains.count)
    saveState(setResult, data, setCursor, setPage, page + 1, setCount)
  }

  async function handleLastPageButtonClick(
    //@ts-ignore
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    const { data } = await client.query({
      query: GET_DATA,
      variables: {
        email: searchText,
        last: rowsPerPage,
      },
    })
    saveState(
      setResult,
      data,
      setCursor,
      setPage,
      Math.max(0, Math.ceil(count / rowsPerPage) - 1),
      setCount,
    )
  }

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
  const [result, setResult] = React.useState([])
  const [cursor, setCursor] = React.useState({ after: null, before: null })
  const [count, setCount] = React.useState(0)

  if (!props.admin) {
    return <AdminError />
  }

  const onTextBoxChange = (event: any) => {
    setSearchText(event.target.value)
  }
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  interface HandleChangeRowsPerPageProps {
    eventValue: string
    client: ApolloClient<any>
  }
  async function handleChangeRowsPerPage(props: HandleChangeRowsPerPageProps) {
    const { eventValue, client } = props
    if (searchText !== "") {
      const { data } = await client.query({
        query: GET_DATA,
        variables: { email: searchText, first: parseInt(eventValue, 10) },
      })
      saveState(setResult, data, setCursor, setPage, 0, setCount)
    } else setPage(0)
    setRowsPerPage(parseInt(eventValue, 10))
  }
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
      <ApolloConsumer>
        {client => (
          <div>
            <StyledForm
              onSubmit={async (event: any) => {
                event.preventDefault()
                const { data } = await client.query({
                  query: GET_DATA,
                  variables: { email: searchText, first: rowsPerPage },
                })
                saveState(setResult, data, setCursor, setPage, 0, setCount)
              }}
            >
              <StyledTextField
                id="standard-search"
                label="Search by email"
                type="search"
                margin="normal"
                onChange={onTextBoxChange}
              />

              <StyledButton
                variant="contained"
                onClick={async (event: any) => {
                  event.preventDefault()
                  const { data } = await client.query({
                    query: GET_DATA,
                    variables: { email: searchText, first: rowsPerPage },
                  })
                  saveState(setResult, data, setCursor, setPage, 0, setCount)
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
                      <StyledTableCell align="right">
                        upstream_id
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        First Name
                      </StyledTableCell>
                      <StyledTableCell align="right">Last Name</StyledTableCell>
                      <StyledTableCell align="right">
                        Student Number
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Completions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <RenderResults data={result} />
                  <TableFooter>
                    <TableRow>
                      <td align="left">
                        <TablePagination
                          rowsPerPageOptions={[10, 20, 50]}
                          colSpan={3}
                          count={count}
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
                              client,
                            }
                            return handleChangeRowsPerPage(newProps)
                          }}
                          ActionsComponent={props => {
                            const newProps: TablePaginationActionsProps = {
                              ...props,
                              client,
                              setCount,
                              setCursor,
                              setPage,
                              searchText,
                              setResult,
                              cursor,
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
        )}
      </ApolloConsumer>
    </Container>
  )
}
interface RenderResultsProps {
  data: UserEmailContains_userEmailContains_edges[]
}
const RenderResults = (props: RenderResultsProps) => {
  const data = props.data

  if (data.length < 1)
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
  query UserEmailContains(
    $email: String!
    $before: ID
    $after: ID
    $first: Int
    $last: Int
  ) {
    userEmailContains(
      email: $email
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
      count(email: $email)
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
    namespacesRequired: ["common"],
  }
}

export default UserSearch

function saveState(
  setResult: any,
  data: UserEmailContains,
  setCursor: any,
  setPage: any,
  newPage: number,
  setCount: any,
) {
  setResult(data.userEmailContains.edges)
  setCursor({
    before: data.userEmailContains.pageInfo.startCursor,
    after: data.userEmailContains.pageInfo.endCursor,
  })
  setCount(data.userEmailContains.count)
  setPage(newPage)
}
