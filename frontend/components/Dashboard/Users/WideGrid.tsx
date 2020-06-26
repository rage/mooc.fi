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
import Pagination from "/components/Dashboard/Users/Pagination"
import getUsersTranslator from "/translations/users"
import LanguageContext from "/contexes/LanguageContext"
import UserSearchContext from "/contexes/UserSearchContext"

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

const WideGrid = () => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)
  const { data, rowsPerPage, page, loading } = useContext(UserSearchContext)

  const PaginationComponent = useCallback(
    () => (
      <TableRow>
        <td colSpan={5} align="center">
          {loading ? (
            <TableCell>
              <Skeleton />
            </TableCell>
          ) : (
            <Pagination />
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
          <RenderResults />
          <TableFooter>
            <PaginationComponent />
          </TableFooter>
        </Table>
      </TableWrapper>
    </StyledPaper>
  )
}

const RenderResults = () => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)
  const { data, loading } = useContext(UserSearchContext)

  const results = data?.userDetailsContains?.edges ?? []

  if (loading) {
    return (
      <TableBody>
        {range(5).map((n) => (
          <TableRow key={`skeleton-${n}`}>
            <TableCell colSpan={5}>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  if (!results || results?.length < 1)
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>{t("noResults")}</TableCell>
        </TableRow>
      </TableBody>
    )

  return (
    <TableBody>
      {results.map((row) => {
        const { upstream_id, email, first_name, last_name, student_number } =
          row?.node ?? {}

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
