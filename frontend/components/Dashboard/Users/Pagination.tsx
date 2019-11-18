import React from "react"
import { TablePagination } from "@material-ui/core"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"

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
}) => (
  <TablePagination
    rowsPerPageOptions={[10, 20, 50]}
    colSpan={3}
    count={data?.userDetailsContains?.count ?? 0}
    rowsPerPage={rowsPerPage}
    page={page}
    SelectProps={{
      inputProps: { "aria-label": "rows per page" },
      native: true,
    }}
    onChangePage={() => null}
    onChangeRowsPerPage={(
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const eventValue = event.target.value

      return handleChangeRowsPerPage({ eventValue })
    }}
    ActionsComponent={props => {
      return TablePaginationActions({
        ...props,
        setPage,
        searchText,
        loadData,
        data,
      })
    }}
  />
)

export default Pagination
