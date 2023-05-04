import { useContext } from "react"

import { range } from "lodash"

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
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import Pagination from "./Pagination"
import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import UsersTranslations from "/translations/users"

const TableWrapper = styled("div")`
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

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`

const CenteredSkeleton = styled(Skeleton)`
  margin: auto;
`

const PaginationComponent: React.FC<{ loading?: boolean }> = ({ loading }) => (
  <TableRow>
    {loading ? (
      <TableCell colSpan={5}>
        <CenteredSkeleton width="400px" />
      </TableCell>
    ) : (
      <Pagination />
    )}
  </TableRow>
)

const WideGrid = () => {
  const t = useTranslator(UsersTranslations)
  const isVeryWide = useMediaQuery("(min-width: 1200px)")
  const { rowsPerPage, loading } = useContext(UserSearchContext)

  return (
    <StyledPaper>
      <TableWrapper>
        <Table>
          <TableHead>
            {rowsPerPage >= 50 ? (
              <PaginationComponent loading={loading} />
            ) : null}
            <TableRow>
              <StyledTableCell component="th" scope="row">
                {t("userFullName")}
              </StyledTableCell>
              <StyledTableCell align="right">{t("userEmail")}</StyledTableCell>
              <StyledTableCell align="right">{t("userTMCid")}</StyledTableCell>
              {isVeryWide && (
                <StyledTableCell align="right">
                  {t("userStudentNumber")}
                </StyledTableCell>
              )}
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <RenderResults />
          <TableFooter>
            <PaginationComponent loading={loading} />
          </TableFooter>
        </Table>
      </TableWrapper>
    </StyledPaper>
  )
}

const RenderResults = () => {
  const t = useTranslator(UsersTranslations)
  const { data, loading, meta } = useContext(UserSearchContext)
  const isVeryWide = useMediaQuery("(min-width: 1200px)")
  const colSpan = 5 + (isVeryWide ? 1 : 0)

  if (loading && data.length < 1) {
    return (
      <TableBody>
        {range(5).map((n) => (
          <TableRow key={`skeleton-${n}`}>
            <TableCell colSpan={colSpan}>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  if (data.length < 1) {
    if (!meta.finished) {
      return null
    }

    return (
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row" colSpan={colSpan}>
            {t("noResults")}
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {data.map((row) => {
        const { upstream_id, email, full_name, student_number } = row ?? {}

        return (
          <TableRow key={upstream_id}>
            <TableCell component="th" scope="row">
              <strong>{full_name}</strong>
            </TableCell>
            <TableCell align="right">{email}</TableCell>
            <TableCell align="right">{upstream_id}</TableCell>
            {isVeryWide && (
              <TableCell align="right">{student_number}</TableCell>
            )}
            <TableCell align="right">
              <ButtonContainer>
                <Button
                  href={`/users/${upstream_id}/summary`}
                  variant="contained"
                >
                  {t("summary")}
                </Button>
                <Button
                  href={`/users/${upstream_id}/completions`}
                  variant="contained"
                >
                  {t("completions")}
                </Button>
              </ButtonContainer>
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

export default WideGrid
