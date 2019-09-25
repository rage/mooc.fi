import React from "react"
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TableHead,
} from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"
import styled from "styled-components"
import range from "lodash/range"
import LangLink from "/components/LangLink"
import {
  UserDetailsContains_userDetailsContains_edges,
  UserDetailsContains,
} from "/static/types/generated/UserDetailsContains"
import Pagination from "/components/Dashboard/Users/Pagination"

const TableWrapper = styled.div`
  overflow-x: auto;
`

const StyledTableCell = styled(TableCell)`
  background-color: black;
  color: white;
`

const StyledPaper = styled(Paper)`
  width: 100%;
  margin-top: 5px;
`

/* interface TablePaginationActionsProps {
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
} */

interface GridProps {
  data: UserDetailsContains
  loadData: Function
  loading: boolean
  handleChangeRowsPerPage: (props: { eventValue: string }) => void
  TablePaginationActions: Function /* (
    props: TablePaginationActionsProps,
  ) =>  */
  page: number
  rowsPerPage: number
  searchText: string
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const WideGrid = ({
  data,
  loadData,
  loading,
  handleChangeRowsPerPage,
  TablePaginationActions,
  page,
  rowsPerPage,
  searchText,
  setPage,
}: GridProps) => (
  <StyledPaper>
    <TableWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Email</StyledTableCell>
            {/*             <StyledTableCell align="right">upstream_id</StyledTableCell> */}
            <StyledTableCell align="right">First name</StyledTableCell>
            <StyledTableCell align="right">Last name</StyledTableCell>
            <StyledTableCell align="right">Student Number</StyledTableCell>
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
              <Pagination
                data={data}
                rowsPerPage={rowsPerPage}
                page={page}
                setPage={setPage}
                searchText={searchText}
                loadData={loadData}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                TablePaginationActions={TablePaginationActions}
              />
            </td>
          </TableRow>
        </TableFooter>
      </Table>
    </TableWrapper>
  </StyledPaper>
)

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
          <TableCell>No results</TableCell>
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
          {/*           <TableCell align="right">{row.node.upstream_id}</TableCell> */}
          <TableCell align="right">{row.node.first_name}</TableCell>
          <TableCell align="right">{row.node.last_name}</TableCell>
          <TableCell align="right">{row.node.student_number}</TableCell>
          <TableCell align="right">
            <LangLink
              as={`/users/${row.node.upstream_id}/completions`}
              href="/users/[id]/completions"
              passHref
            >
              <Button variant="contained">Completions</Button>
            </LangLink>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default WideGrid
