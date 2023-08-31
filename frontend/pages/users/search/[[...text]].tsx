import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"

import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/Search/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext, {
  UserSearchResults,
} from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsNew from "/hooks/useIsNew"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useSearch } from "/hooks/useSearch"
import withAdmin from "/lib/with-admin"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  UserSearchDocument,
  UserSearchField,
  UserSearchMetaFieldsFragment,
  UserSearchSubscriptionVariables,
} from "/graphql/generated"

const emptyResults: UserSearchResults = {
  data: [],
  meta: {} as UserSearchMetaFieldsFragment,
  totalMeta: [],
}

const UserSearch = () => {
  const isNew = useIsNew()
  const baseUrl = isNew ? "/_new/admin" : ""
  const router = useRouter()
  const client = useApolloClient()
  const textParam = useQueryParameter("text", { enforce: false })
  const pageParam =
    parseInt(useQueryParameter("page", { enforce: false }), 10) || 0
  const rowsParam =
    parseInt(useQueryParameter("rowsPerPage", { enforce: false }), 10) || 10
  const fieldsParam = useQueryParameter("fields", {
    enforce: false,
    array: true,
  }).filter(isDefinedAndNotEmpty) as Array<UserSearchField>
  const isSearching = useRef(false)
  const prevSearch = useRef("")
  const prevFields = useRef<Array<UserSearchField> | undefined>(fieldsParam)

  const fieldsParamValue =
    fieldsParam && fieldsParam.length === 0
      ? (Object.keys(UserSearchField) as Array<UserSearchField>)
      : fieldsParam

  const [results, setResults] = useState<UserSearchResults>(emptyResults)
  const [fields, setFields] = useState<Array<UserSearchField> | undefined>(
    fieldsParamValue,
  )

  const userSearch = useSearch({
    search: textParam,
    page: pageParam,
    rowsPerPage: rowsParam,
  })

  const [searchVariables, setSearchVariables] =
    useState<UserSearchSubscriptionVariables>({
      search: textParam,
      fields: fieldsParamValue,
    })

  const subscription = useRef<ReturnType<
    ReturnType<typeof client.subscribe>["subscribe"]
  > | null>(null)

  const resetResults = useCallback(() => {
    setResults({ ...emptyResults })
  }, [emptyResults])

  const { rowsPerPage, page } = userSearch

  useEffect(() => {
    if ((searchVariables.search ?? "").trim().length < 3) {
      return
    }
    if (
      prevSearch.current === searchVariables.search &&
      prevFields.current === searchVariables.fields
    ) {
      return
    }
    prevSearch.current = searchVariables.search
    prevFields.current =
      (searchVariables.fields as Array<UserSearchField>) ?? undefined
    if (subscription.current) {
      subscription.current.unsubscribe()
    }
    const observer = client.subscribe({
      query: UserSearchDocument,
      variables: {
        search: searchVariables.search,
        fields: searchVariables.fields,
      },
      fetchPolicy: "cache-first",
    })
    const newSubscription = observer.subscribe({
      next: ({ data }) => {
        if (!data) {
          return
        }
        if (
          data &&
          isDefinedAndNotEmpty(data.userSearch) &&
          data.userSearch.search === searchVariables.search
        ) {
          setResults((prev) => {
            const {
              matches,
              field,
              fieldValue,
              count,
              allMatchIds,
              fieldIndex,
              fieldCount,
              fieldResultCount,
              fieldUniqueResultCount,
              finished,
            } = data.userSearch
            const meta = {
              field,
              fieldValue: fieldValue ?? "",
              search: searchVariables.search,
              count: count ?? 0,
              allMatchIds: allMatchIds ?? [],
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
          if (data.userSearch?.finished) {
            isSearching.current = false
            subscription.current?.unsubscribe()
          }
        }
      },
      complete: () => {
        setResults((prev) => ({
          ...prev,
          meta: {
            ...prev.meta,
            finished: true,
          },
        }))
        isSearching.current = false
        subscription.current?.unsubscribe()
      },
      error: (e) => {
        setResults((prev) => ({
          ...prev,
          meta: {
            ...prev.meta,
            finished: true,
          },
        }))
        console.error(e)
        isSearching.current = false
        subscription.current?.unsubscribe()
      },
    })
    subscription.current = newSubscription
    isSearching.current = true
  }, [
    searchVariables.search,
    searchVariables.fields,
    prevSearch.current,
    prevFields.current,
  ])

  useEffect(() => {
    return () => {
      subscription.current?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (rowsPerPage !== 10) {
      params.append("rowsPerPage", rowsPerPage.toString())
    }
    if (page > 0) {
      params.append("page", page.toString())
    }
    const href =
      searchVariables.search !== ""
        ? `${baseUrl}/users/search/${encodeURIComponent(
            searchVariables.search,
          )}`
        : `${baseUrl}/users/search`
    if (router?.asPath !== href) {
      // the history is still a bit wonky - how should it work?
      router.push({ href, query: params.toString() }, undefined, {
        shallow: true,
      })
    }
  }, [rowsPerPage, page, searchVariables])

  const crumbs: Breadcrumb[] = [
    {
      translation: "users",
    },
    {
      translation: "userSearch",
      href: `${baseUrl}/users/search`,
    },
  ]

  if (textParam) {
    crumbs.push({
      translation: "userSearchResults",
      href: `${baseUrl}/users/search/${encodeURIComponent(textParam)}`,
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
      fields,
      setFields,
      resetResults,
      setResults,
    }),
    [
      fields,
      results.meta,
      results.data,
      isSearching.current,
      userSearch,
      searchVariables,
      resetResults,
      setFields,
      setResults,
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
