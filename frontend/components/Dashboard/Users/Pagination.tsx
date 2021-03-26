import {
  useContext,
  useCallback,
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
} from "react"
import { TablePagination } from "@material-ui/core"
import UsersTranslations from "/translations/users"
import UserSearchContext from "../../../contexts/UserSearchContext"
import styled from "@emotion/styled"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import { useTheme } from "@material-ui/core/styles"
import { IconButton } from "@material-ui/core"
import { useTranslator } from "/util/useTranslator"

const StyledFooter = styled.footer`
  flex-shrink: 0;
  margin-left: 2.5;
`

const TablePaginationActions: React.FC<any> = () => {
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

const Pagination: React.FC<any> = () => {
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
    async ({ eventValue }: { eventValue: string }) => {
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
    <TablePagination
      rowsPerPageOptions={[10, 20, 50]}
      colSpan={3}
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
      ) => handleChangeRowsPerPage({ eventValue: event.target.value })}
      ActionsComponent={() => <TablePaginationActions />}
    />
  )
}

export default Pagination
