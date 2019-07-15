import React, { useState } from "react"
import { gql } from "apollo-boost"
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
  const completionLanguage = React.useContext(CourseLanguageContext)
  const { router } = props
  let course
  if (router && router.query) {
    course = router.query.course
  }

  const [queryDetails, setQueryDetails] = useState({
    start: "",
    end: "",
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
      {({ data, error, loading }) => {
        //initialize empty variables for completions, start cursor and end cursor
        let completions: AllCompletions_completionsPaginated_edges_node[] = []
        let endCursor: string = ""
        let startCursor: string = ""

        //if query returns data
        if (data) {
          //extract all completions
          completions = data.completionsPaginated.edges.map(edge => edge.node)
          //if end cursor is not null
          if (data.completionsPaginated.pageInfo.endCursor) {
            //extract end cursor
            endCursor = data.completionsPaginated.pageInfo.endCursor
          }
          if (data.completionsPaginated.pageInfo.startCursor) {
            //extract end cursor
            startCursor = data.completionsPaginated.pageInfo.startCursor
          }
        }

        if (loading) {
          return <CircularProgress color="secondary" />
        }

        if (error) {
          return (
            <div>
              Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
            </div>
          )
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
