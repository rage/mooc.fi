import { useContext, useEffect, useState } from "react"
import { UserDetailsContains } from "/static/types/generated/UserDetailsContains"
import Container from "/components/Container"
import { gql, useLazyQuery } from "@apollo/client"
import withAdmin from "/lib/with-admin"
import LanguageContext from "../../../../contexts/LanguageContext"
import { useQueryParameter } from "/util/useQueryParameter"
import { useRouter } from "next/router"
import UserSearchContext, {
  SearchVariables,
} from "../../../../contexts/UserSearchContext"
import SearchForm from "/components/Dashboard/Users/SearchForm"

const UserSearch = () => {
  const { language } = useContext(LanguageContext)
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

  useEffect(() => {
    const params = [
      rowsPerPage !== 10 ? `rowsPerPage=${rowsPerPage}` : "",
      page > 0 ? `page=${page}` : "",
    ].filter((v) => !!v)
    const query = params.length ? `?${params.join("&")}` : ""
    const as =
      searchVariables.search !== ""
        ? `/${language}/users/search/${searchVariables.search}${query}`
        : `/${language}/users/search${query}`
    const href =
      searchVariables.search !== ""
        ? "/[lng]/users/search/[text]"
        : "/[lng]/users/search"

    if (router?.pathname !== "/[lng]/users/search") {
      loadData({
        variables: searchVariables,
      })
    }

    if (router?.asPath !== as) {
      // the history is still a bit wonky - how should it work?
      router.push(href, as, { shallow: true })
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
