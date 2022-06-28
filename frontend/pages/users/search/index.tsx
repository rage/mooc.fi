import Container from "/components/Container"
import SearchForm from "/components/Dashboard/Users/SearchForm"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import UserSearchContext, { SearchVariables } from "/contexts/UserSearchContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import { useQueryParameter } from "/util/useQueryParameter"
import { gql, useLazyQuery } from "@apollo/client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

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

  const [loadData, { data, loading }] = useLazyQuery<UserDetailsContains>(
    GET_DATA,
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
            data: data || ({} as UserDetailsContains),
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

const GET_DATA = gql`
  query UserDetailsContains(
    $search: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $skip: Int
  ) {
    userDetailsContains(
      search: $search
      first: $first
      last: $last
      before: $before
      after: $after
      skip: $skip
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          email
          student_number
          real_student_number
          upstream_id
          first_name
          last_name
        }
      }
      count(search: $search)
    }
  }
`

export default withAdmin(UserSearch)
