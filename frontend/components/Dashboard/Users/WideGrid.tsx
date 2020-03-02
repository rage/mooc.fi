import React, { useCallback, useContext } from "react"
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
import getUsersTranslator from "/translations/users"
import LanguageContext from "/contexes/LanguageContext"

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
  updateRoute: (_: string, __: number, ___: number) => void
  setSearchVariables: React.Dispatch<React.SetStateAction<any>>
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
  updateRoute,
  setSearchVariables,
}: GridProps) => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)

  const PaginationComponent = useCallback(
    () => (
      <TableRow>
        <td colSpan={5} align="center">
          {loading ? (
            <Skeleton />
          ) : (
            <Pagination
              data={data}
              rowsPerPage={rowsPerPage}
              page={page}
              setPage={setPage}
              searchText={searchText}
              loadData={loadData}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              TablePaginationActions={TablePaginationActions}
              updateRoute={updateRoute}
              setSearchVariables={setSearchVariables}
            />
          )}
        </td>
      </TableRow>
    ),
    [data, rowsPerPage, page, loading],
  )

  return (
    <StyledPaper>
      <TableWrapper>
        <Table>
          <TableHead>
            {rowsPerPage >= 50 && data?.userDetailsContains?.edges?.length ? (
              <PaginationComponent />
            ) : null}
            <TableRow>
              <StyledTableCell>{t("userEmail")}</StyledTableCell>
              {/*             <StyledTableCell align="right">upstream_id</StyledTableCell> */}
              <StyledTableCell align="right">
                {t("userFirstName")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {t("userLastName")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {t("userStudentNumber")}
              </StyledTableCell>
              <StyledTableCell align="right">
                {t("completions")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <RenderResults
            data={data?.userDetailsContains?.edges ?? []}
            loading={loading}
          />
          <TableFooter>
            <PaginationComponent />
          </TableFooter>
        </Table>
      </TableWrapper>
    </StyledPaper>
  )
}

interface RenderResultsProps {
  data: UserDetailsContains_userDetailsContains_edges[]
  loading: boolean
}

const RenderResults = (props: RenderResultsProps) => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)
  const { data, loading } = props

  if (loading) {
    return (
      <TableBody>
        {range(5).map(n => (
          <TableRow key={`skeleton-${n}`}>
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
          <TableCell colSpan={5}>{t("noResults")}</TableCell>
        </TableRow>
      </TableBody>
    )

  return (
    <TableBody>
      {data.map(row => {
        const {
          upstream_id,
          email,
          first_name,
          last_name,
          student_number,
        } = row.node

        return (
          <TableRow key={upstream_id}>
            <TableCell component="th" scope="row">
              {email}
            </TableCell>
            <TableCell align="right">{first_name}</TableCell>
            <TableCell align="right">{last_name}</TableCell>
            <TableCell align="right">{student_number}</TableCell>
            <TableCell align="right">
              <LangLink
                as={`/users/${upstream_id}/completions`}
                href="/users/[id]/completions"
                passHref
              >
                <Button variant="contained">Completions</Button>
              </LangLink>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default WideGrid
