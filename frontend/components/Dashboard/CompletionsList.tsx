import React, { useState } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { Query } from "react-apollo"
import {
  AllCompletions as AllCompletionsData,
  AllCompletions_completionsPaginated_edges_node,
} from "./__generated__/AllCompletions"
import { CircularProgress } from "@material-ui/core"
import { withRouter } from "next/router"
import CompletionsListWithData from "./CompletionsListWithData"
import CourseLanguageContext from "../../contexes/CourseLanguageContext"

export const AllCompletionsQuery = gql`
  query AllCompletions(
    $course: String
    $cursor: ID
    $completion_language: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completion_language
      first: 15
      after: $cursor
    ) {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        node {
          id
          email
          completion_language
          created_at
          user {
            id
            first_name
            last_name
            student_number
          }
          course {
            id
            name
          }
          completions_registered {
            id
            organization {
              slug
            }
          }
        }
      }
    }
  }
`
export const PreviousPageCompletionsQuery = gql`
  query AllCompletions(
    $course: String
    $cursor: ID
    $completion_language: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completion_language
      last: 15
      before: $cursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          email
          completion_language
          created_at
          user {
            id
            first_name
            last_name
            student_number
          }
          course {
            id
            name
          }
          completions_registered {
            id
            organization {
              id
              slug
            }
          }
        }
      }
    }
  }
`
class CompletionsQuery extends Query<AllCompletionsData, {}> {}

const CompletionsList = withRouter(props => {
  const { router } = props
  const completionLanguage = React.useContext(CourseLanguageContext)
  let course: string | string[] = ""

  if (router && router.query && router.query.course) {
    course = router.query.course
  }

  interface queryDetailsInterface {
    start: string | null
    end: string | null
    back: boolean
    page: number
  }

  const [queryDetails, setQueryDetails] = useState<queryDetailsInterface>({
    start: null,
    end: null,
    back: false,
    page: 1,
  })

  const query = queryDetails.back
    ? PreviousPageCompletionsQuery
    : AllCompletionsQuery

  const cursor = queryDetails.back ? queryDetails.end : queryDetails.start

  return (
    <CompletionsQuery
      query={query}
      variables={{
        cursor,
        completion_language: completionLanguage,
        course,
      }}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        let completions: AllCompletions_completionsPaginated_edges_node[] = []
        let startCursor: string | null = null
        let endCursor: string | null = null

        if (loading) {
          return <CircularProgress color="secondary" />
        }
        if (error) {
          ;<div>
            Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
          </div>
        }
        if (data) {
          completions = data.completionsPaginated.edges.map(edge => edge.node)
          startCursor = data.completionsPaginated.pageInfo.startCursor
          endCursor = data.completionsPaginated.pageInfo.endCursor
        }

        return (
          <CompletionsListWithData
            completions={completions}
            onLoadMore={() =>
              setQueryDetails({
                start: endCursor,
                end: startCursor,
                back: false,
                page: queryDetails.page + 1,
              })
            }
            onGoBack={() =>
              setQueryDetails({
                start: endCursor,
                end: startCursor,
                back: true,
                page: queryDetails.page - 1,
              })
            }
            pageNumber={queryDetails.page}
          />
        )
      }}
    </CompletionsQuery>
  )
})

export default CompletionsList
