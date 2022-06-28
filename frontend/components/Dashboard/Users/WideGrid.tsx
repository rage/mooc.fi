import { useCallback, useContext } from "react"

import styled from "@emotion/styled"
import {
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material"
import range from "lodash/range"
import Link from "next/link"

import Pagination from "/components/Dashboard/Users/Pagination"
import UserSearchContext from "/contexts/UserSearchContext"
import UsersTranslations from "/translations/users"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const WideGrid = () => {
  const t = useTranslator(UsersTranslations)
  const { data, rowsPerPage, page, loading } = useContext(UserSearchContext)

  const PaginationComponent = useCallback(
    () => (
      <TableRow>
        {loading ? (
          <TableCell>
            <Skeleton />
          </TableCell>
        ) : (
          <Pagination />
        )}
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
              <StyledTableCell align="right"></StyledTableCell>
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
  const t = useTranslator(UsersTranslations)
  const { data, loading } = useContext(UserSearchContext)

  const results = data?.userDetailsContains?.edges?.filter(notEmpty) ?? []

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
              <ButtonContainer>
                <Link href={`/users/${upstream_id}/summary`} passHref>
                  <Button variant="contained">{t("summary")}</Button>
                </Link>
                <Link href={`/users/${upstream_id}/completions`} passHref>
                  <Button variant="contained">{t("completions")}</Button>
                </Link>
              </ButtonContainer>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default WideGrid
