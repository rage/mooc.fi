import { useEffect, useMemo, useState } from "react"

import { useRouter } from "next/router"

import { useLazyQuery } from "@apollo/client"

import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext, { SearchVariables } from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"

import { UserDetailsContainsDocument } from "/graphql/generated"

const UserSearch = () => {
  const router = useRouter()
  const textParam = useQueryParameter("text", false)
  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10
  const [searchVariables, setSearchVariables] = useState<SearchVariables>({
    search: textParam,
    first: rowsParam,
    skip: pageParam > 0 ? pageParam * rowsParam : undefined,
  })

  const [page, setPage] = useState(pageParam)
  const [rowsPerPage, setRowsPerPage] = useState(rowsParam)

  const [loadData, { data, loading }] = useLazyQuery(
    UserDetailsContainsDocument,
    {
      ssr: false,
    },
  )

  const crumbs: Breadcrumb[] = [
    {
      translation: "users",
    },
    {
      translation: "userSearch",
      href: "/users/search",
    },
  ]
  if (textParam) {
    crumbs.push({
      translation: "userSearchResults",
      href: `/users/search/${encodeURIComponent(textParam)}`,
    })
  }
  useBreadcrumbs(crumbs)

  useEffect(() => {
    const searchParams = new URLSearchParams()
    if (rowsPerPage !== 10) {
      searchParams.append("rowsPerPage", rowsPerPage.toString())
    }
    if (page > 0) {
      searchParams.append("page", page.toString())
    }
    const query =
      searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ""
    const href =
      searchVariables.search !== ""
        ? `/users/search/${encodeURIComponent(searchVariables.search)}${query}`
        : `/users/search${query}`

    if (router?.pathname !== "/users/search") {
      loadData({
        variables: searchVariables,
      })
    }

    if (router?.asPath !== href) {
      // the history is still a bit wonky - how should it work?
      router.push(href, undefined, { shallow: true })
    }
  }, [searchVariables, rowsPerPage, page])

  const contextValue = useMemo(
    () => ({
      data,
      loading,
      page,
      rowsPerPage,
      searchVariables,
      setPage,
      setSearchVariables,
      setRowsPerPage,
    }),
    [data, loading, page, rowsPerPage, searchVariables],
  )
  return (
    <>
      <Container>
        <UserSearchContext.Provider value={contextValue}>
          <SearchForm />
        </UserSearchContext.Provider>
      </Container>
    </>
  )
}

export default withAdmin(UserSearch)
