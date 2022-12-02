import { useMemo, useState } from "react"

interface UserSearchOptions {
  page?: number
  rowsPerPage?: number
  search?: string
}

export function useSearch(opts: UserSearchOptions = {}) {
  const {
    search: _search = "",
    page: _page = 0,
    rowsPerPage: _rowsPerPage = 10,
  } = opts
  const [search, setSearch] = useState(_search)
  const [page, setPage] = useState(_page)
  const [rowsPerPage, setRowsPerPage] = useState(_rowsPerPage)

  const value = useMemo(
    () => ({
      page,
      rowsPerPage,
      search,
      setPage,
      setRowsPerPage,
      setSearch,
    }),
    [page, search, rowsPerPage],
  )

  return value
}
