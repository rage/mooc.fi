import { useEffect, useState } from "react"

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
    const params = [
      rowsPerPage !== 10 ? `rowsPerPage=${rowsPerPage}` : "",
      page > 0 ? `page=${page}` : "",
    ].filter((v) => !!v)
    const query = params.length ? `?${params.join("&")}` : ""
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

  return (
    <>
      <Container>
        <UserSearchContext.Provider
          value={{
            data,
            loading,
            page,
            rowsPerPage,
            searchVariables,
            setPage,
            setSearchVariables,
            setRowsPerPage,
          }}
        >
          <SearchForm />
        </UserSearchContext.Provider>
      </Container>
    </>
  )
}

export default withAdmin(UserSearch)
