import {
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
} from "react"

import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import LastPageIcon from "@mui/icons-material/LastPage"
import {
  IconButton,
  LabelDisplayedRowsArgs,
  TablePagination,
} from "@mui/material"
import { styled, useTheme } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import UserSearchContext from "/contexts/UserSearchContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import UsersTranslations from "/translations/users"

const StyledTablePagination = styled(TablePagination)`
  .MuiTablePagination-toolbar {
    padding: 0.5rem;
    justify-content: center !important;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .MuiTablePagination-selectRoot {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .MuiTablePagination-spacer {
    flex: 0 !important;
  }
` as typeof TablePagination

const TablePaginationActions: React.FC = () => {
  const t = useTranslator(CommonTranslations)
  const theme = useTheme()

  const { meta, page, rowsPerPage, setPage } = useContext(UserSearchContext)

  const { count } = meta

  const handleFirstPageButtonClick = useEventCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPage(0)
    },
  )

  const handleBackButtonClick = useEventCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPage((p) => p - 1)
    },
  )

  const handleNextButtonClick = useEventCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPage((p) => p + 1)
    },
  )

  const handleLastPageButtonClick = useCallback(
    async (_: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    },
    [count, rowsPerPage],
  )

  return (
    <>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label={t("firstPage")}
        size="large"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={t("previousPage")}
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
        disabled={!count || page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("nextPage")}
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
        disabled={!count || page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("lastPage")}
        size="large"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </>
  )
}

const Pagination: React.FC = () => {
  const t = useTranslator(UsersTranslations)
  const { meta, rowsPerPage, page, setPage, setRowsPerPage } =
    useContext(UserSearchContext)

  const handleChangeRowsPerPage = useEventCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newRowsPerPage = parseInt(e.target.value, 10)

      setPage(0)
      setRowsPerPage(newRowsPerPage)
    },
  )

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: LabelDisplayedRowsArgs) => {
      if (count === 0) {
        return ""
      }
      const toOrCount = to === -1 ? count : to

      return `${from}-${toOrCount}${t("displayedRowsOf")}${count}`
    },
    [t],
  )

  const onPageChange = useEventCallback(() => null)

  return (
    <StyledTablePagination
      rowsPerPageOptions={[10, 20, 50]}
      count={meta.count ?? 0}
      rowsPerPage={rowsPerPage}
      page={page}
      SelectProps={{
        inputProps: { "aria-label": t("rowsPerPage") },
      }}
      labelRowsPerPage={t("rowsPerPage")}
      labelDisplayedRows={labelDisplayedRows}
      onPageChange={onPageChange}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  )
}

export default Pagination
