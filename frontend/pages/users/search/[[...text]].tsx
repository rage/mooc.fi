import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useSubscription } from "@apollo/client"

import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext, {
  UserSearchResults,
} from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useSearch } from "/hooks/useSearch"
import withAdmin from "/lib/with-admin"
import { notEmptyOrEmptyString } from "/util/guards"
import notEmpty from "/util/notEmpty"

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
  const router = useRouter()
  const textParam = useQueryParameter("text", false)
  const pageParam = parseInt(useQueryParameter("page", false), 10) || 0
  const rowsParam = parseInt(useQueryParameter("rowsPerPage", false), 10) || 10
  const fieldsParam = useQueryParameter("fields", false)
    ?.split(",")
    .filter(notEmptyOrEmptyString) as Array<UserSearchField>
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

  console.log(fieldsParam)
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

  useSubscription(UserSearchDocument, {
    variables: {
      search: searchVariables.search,
      fields: searchVariables.fields,
    },
    shouldResubscribe: true,
    fetchPolicy: "cache-first",
    skip: (searchVariables.search ?? "").length < 3,
    onData({ data }) {
      if (!data.data) {
        return
      }

      if (
        data.data &&
        notEmpty(data.data.userSearch) &&
        data.data.userSearch.search === searchVariables.search
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
          } = data.data!.userSearch
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
        if (data.data?.userSearch?.finished) {
          isSearching.current = false
          // subscription.unsubscribe()
        }
      }
    },
    onError(_error) {
      setResults((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          finished: true,
        },
      }))
      isSearching.current = false
    },
    onComplete() {
      isSearching.current = false
    },
  })

  const resetResults = useCallback(() => {
    setResults({ ...emptyResults })
  }, [setResults])

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
    isSearching.current = true
  }, [
    searchVariables.search,
    searchVariables.fields,
    prevSearch.current,
    prevFields.current,
  ])

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
