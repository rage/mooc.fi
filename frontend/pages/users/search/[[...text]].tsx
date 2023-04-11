import { useCallback, useEffect, useMemo, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useSubscription } from "@apollo/client"

import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useSearch } from "/hooks/useSearch"
import withAdmin from "/lib/with-admin"

import {
  UserCoreFieldsFragment,
  UserDetailsContainsQueryVariables,
  UserSearchDocument,
} from "/graphql/generated"

const UserSearch = () => {
  const router = useRouter()
  const textParam = useQueryParameter("text", false)
  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10

  const [results, setResults] = useState<Array<UserCoreFieldsFragment>>([])

  const userSearch = useSearch({
    page: pageParam,
    rowsPerPage: rowsParam,
  })

  const [searchVariables, setSearchVariables] =
    useState<UserDetailsContainsQueryVariables>({
      search: textParam,
      first: rowsParam,
      skip: pageParam > 0 ? pageParam * rowsParam : undefined,
    })

  const resetResults = useCallback(() => setResults([]), [setResults])

  const { data, loading } = useSubscription(UserSearchDocument, {
    variables: { search: searchVariables.search },
    onData: ({ data }) => {
      console.log("onData", data)
      if (data.data) {
        setResults((prev) => [
          ...prev.concat(data.data?.userSearch.matches ?? []),
        ])
      }
    },
    skip: !searchVariables.search,
  })

  const { rowsPerPage, page } = userSearch

  useEffect(() => {
    if ((searchVariables.search ?? "").trim().length === 0) {
      return
    }
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

    if (router?.asPath !== href) {
      // the history is still a bit wonky - how should it work?
      router.push(href, undefined, { shallow: true })
    }
  }, [searchVariables, rowsPerPage, page])

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

  const value = useMemo(
    () => ({
      ...userSearch,
      data: { count: data?.userSearch.count, matches: results },
      loading,
      searchVariables,
      setSearchVariables,
      resetResults,
    }),
    [results, loading, userSearch, searchVariables, resetResults],
  )

  return (
    <>
      <NextSeo title={textParam} />
      <Container>
        <UserSearchContext.Provider value={value}>
          <SearchForm />
        </UserSearchContext.Provider>
      </Container>
    </>
  )
}

export default withAdmin(UserSearch)
