import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"

import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useSearch } from "/hooks/useSearch"
import withAdmin from "/lib/with-admin"
import notEmpty from "/util/notEmpty"

import {
  UserCoreFieldsFragment,
  UserDetailsContainsQueryVariables,
  UserSearchDocument,
  UserSearchMetaFieldsFragment,
} from "/graphql/generated"

interface UserSearchResults {
  data: Array<UserCoreFieldsFragment>
  meta: UserSearchMetaFieldsFragment
  totalMeta: Array<UserSearchMetaFieldsFragment>
}

const emptyResults: UserSearchResults = {
  data: [],
  meta: {} as UserSearchMetaFieldsFragment,
  totalMeta: [],
}

const UserSearch = () => {
  const router = useRouter()
  const client = useApolloClient()
  const textParam = useQueryParameter("text", false)
  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10
  const isSearching = useRef(false)
  const [results, setResults] = useState<UserSearchResults>(emptyResults)

  const userSearch = useSearch({
    search: textParam,
    page: pageParam,
    rowsPerPage: rowsParam,
  })

  const [searchVariables, setSearchVariables] =
    useState<UserDetailsContainsQueryVariables>({
      search: textParam,
      first: rowsParam,
      skip: pageParam > 0 ? pageParam * rowsParam : undefined,
    })

  const resetResults = useCallback(() => {
    setResults({ ...emptyResults })
  }, [setResults])

  const { rowsPerPage, page } = userSearch

  useEffect(() => {
    if ((searchVariables.search ?? "").trim().length === 0) {
      return
    }

    if (!isSearching.current) {
      const observer = client.subscribe({
        query: UserSearchDocument,
        variables: { search: searchVariables.search },
      })
      const subscription = observer.subscribe(
        ({ data }) => {
          if (notEmpty(data?.userSearch)) {
            setResults((prev) => {
              const {
                matches,
                field,
                fieldValue,
                count,
                fieldIndex,
                fieldCount,
                fieldResultCount,
                fieldUniqueResultCount,
                finished,
              } = data?.userSearch ?? {}
              const meta = {
                field: field ?? "",
                fieldValue: fieldValue ?? "",
                search: searchVariables.search,
                count: count ?? 0,
                fieldIndex: fieldIndex ?? 0,
                fieldCount: fieldCount ?? 0,
                fieldResultCount: fieldResultCount ?? 0,
                fieldUniqueResultCount: fieldUniqueResultCount ?? 0,
                finished: finished ?? false,
              }

              return {
                meta,
                totalMeta: [...prev.totalMeta, meta],
                data: [...prev.data.concat(matches ?? [])],
              }
            })
            if (data?.userSearch?.finished) {
              isSearching.current = false
              // subscription.unsubscribe()
            }
          }
        },
        (_error) => {
          setResults((prev) => ({
            ...prev,
            meta: {
              ...prev.meta,
              finished: true,
            },
          }))
          isSearching.current = false
          subscription.unsubscribe()
        },
        () => {
          subscription.unsubscribe()
          isSearching.current = false
        },
      )
      isSearching.current = true
    }
  }, [searchVariables.search])

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
    if (router?.asPath !== href) {
      // the history is still a bit wonky - how should it work?
      router.push(href, undefined, { shallow: true })
    }
  }, [rowsPerPage, page, searchVariables])

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
      meta: results.meta,
      totalMeta: results.totalMeta,
      data: results.data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
      loading: isSearching.current,
      searchVariables,
      setSearchVariables,
      resetResults,
    }),
    [
      results.meta,
      results.data,
      isSearching.current,
      userSearch,
      searchVariables,
      resetResults,
    ],
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
