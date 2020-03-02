import React, { useContext } from "react"
import { TablePagination } from "@material-ui/core"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import getUsersTranslator from "/translations/users"
import LanguageContext from "/contexes/LanguageContext"

interface PaginationProps {
  data: UserDetailsContains
  loadData: Function
  handleChangeRowsPerPage: (props: { eventValue: string }) => void
  TablePaginationActions: Function /* (
    props: TablePaginationActionsProps,
  ) =>  */
  page: number
  rowsPerPage: number
  searchText: string
  setPage: React.Dispatch<React.SetStateAction<number>>
  updateRoute: (_: string, __: number, ___: number) => void
  setSearchVariables: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

const Pagination: React.FC<PaginationProps> = ({
  data,
  rowsPerPage,
  page,
  setPage,
  searchText,
  loadData,
  TablePaginationActions,
  handleChangeRowsPerPage,
  updateRoute,
  setSearchVariables,
}: PaginationProps) => {
  const { language } = useContext(LanguageContext)
  const t = getUsersTranslator(language)

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
        `${from}-${to === -1 ? count : to}${t("displayedRowsOf")}${count}`
      }
      onChangePage={() => null}
      onChangeRowsPerPage={(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => handleChangeRowsPerPage({ eventValue: event.target.value })}
      ActionsComponent={props =>
        TablePaginationActions({
          ...props,
          setPage,
          searchText,
          loadData,
          data,
          updateRoute,
          setSearchVariables,
        })
      }
    />
  )
}

export default Pagination
