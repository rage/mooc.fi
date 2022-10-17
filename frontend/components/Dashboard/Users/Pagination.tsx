import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
} from "react"

import styled from "@emotion/styled"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"
import { IconButton, TablePagination } from "@mui/material"
import { useTheme } from "@mui/material/styles"

import UserSearchContext from "/contexts/UserSearchContext"
import UsersTranslations from "/translations/users"
import { useTranslator } from "/util/useTranslator"

const StyledFooter = styled.footer`
  flex-shrink: 0;
  margin-left: 2.5;
`

const StyledTablePagination = styled(TablePagination)`
  .MuiToolbar-root {
    justify-content: center !important;
  }

  .MuiTablePagination-spacer {
    flex: 0 !important;
  }
`

const TablePaginationActions: React.FC = () => {
  const theme = useTheme()
  const {
    data,
    page,
    rowsPerPage,
    setPage,
    searchVariables,
    setSearchVariables,
  } = useContext(UserSearchContext)

  const startCursor = data?.userDetailsContains?.pageInfo?.startCursor
  const endCursor = data?.userDetailsContains?.pageInfo?.endCursor
  const count = data?.userDetailsContains?.count ?? 0

  const handleFirstPageButtonClick = useCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchVariables.search,
        first: rowsPerPage,
      })
      setPage(0)
    },
    [],
  )

  const handleBackButtonClick = useCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchVariables.search,
        last: rowsPerPage,
        before: startCursor,
      })
      setPage(page - 1)
    },
    [],
  )

  const handleNextButtonClick = useCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchVariables.search,
        first: rowsPerPage,
        after: endCursor,
        skip: 1,
      })
      setPage(page + 1)
    },
    [],
  )

  const handleLastPageButtonClick = useCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchVariables({
        search: searchVariables.search,
        last: rowsPerPage - (rowsPerPage - (count % rowsPerPage)),
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
        size="large"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="large"
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
        size="large"
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
        size="large"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </StyledFooter>
  )
}

const Pagination: React.FC = () => {
  const t = useTranslator(UsersTranslations)
  const {
    data,
    rowsPerPage,
    page,
    setPage,
    setRowsPerPage,
    searchVariables,
    setSearchVariables,
  } = useContext(UserSearchContext)

  const handleChangeRowsPerPage = useCallback(
    async (eventValue: string) => {
      const newRowsPerPage = parseInt(eventValue, 10)

      setSearchVariables({
        search: searchVariables.search,
        first: newRowsPerPage,
      })
      setPage(0)
      setRowsPerPage(newRowsPerPage)
    },
    [searchVariables],
  )

  return (
    <StyledTablePagination
      rowsPerPageOptions={[10, 20, 50]}
      colSpan={5}
      count={data?.userDetailsContains?.count ?? 0}
      rowsPerPage={rowsPerPage}
      page={page}
      SelectProps={{
        inputProps: { "aria-label": t("rowsPerPage") },
        native: true,
      }}
      labelRowsPerPage={t("rowsPerPage")}
      labelDisplayedRows={({ from, to, count }) =>
        count > 0
          ? `${from}-${to === -1 ? count : to}${t("displayedRowsOf")}${count}`
          : ""
      }
      onPageChange={() => null}
      onRowsPerPageChange={(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => handleChangeRowsPerPage(event.target.value)}
      ActionsComponent={() => <TablePaginationActions />}
    />
  )
}

export default Pagination
