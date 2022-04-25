import { useContext, useState } from "react"

import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import { AllCompletions as AllCompletionsData } from "/static/types/generated/AllCompletions"
import { AllCompletionsPrevious as AllCompletionsPreviousData } from "/static/types/generated/AllCompletionsPrevious"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"

import { gql, useQuery } from "@apollo/client"
import { CircularProgress } from "@mui/material"

import CompletionsListWithData from "./CompletionsListWithData"

export const AllCompletionsQuery = gql`
  query AllCompletions(
    $course: String!
    $cursor: String
    $completionLanguage: String
    $search: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      search: $search
      first: 50
      after: $cursor
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
export const PreviousPageCompletionsQuery = gql`
  query AllCompletionsPrevious(
    $course: String!
    $cursor: String
    $completionLanguage: String
    $search: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      search: $search
      last: 50
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

interface CompletionsListProps {
  search?: string
}

const CompletionsList = ({ search }: CompletionsListProps) => {
  const completionLanguage = useContext(CourseLanguageContext)
  const course = useQueryParameter("slug")

  interface queryDetailsInterface {
    start?: string | null
    end?: string | null
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

  interface Variables {
    cursor?: string | null
    course: string | string[]
    completionLanguage?: string
    search?: string
  }

  const variables: Variables = {
    cursor,
    course,
    completionLanguage:
      completionLanguage !== "" ? completionLanguage : undefined,
    search: search !== "" ? search : undefined,
  }

  const { data, loading, error } = useQuery<
    AllCompletionsData | AllCompletionsPreviousData
  >(query, {
    variables,
    fetchPolicy: "network-only",
  })

  if (!course) {
    return <div>no course!</div>
  }

  if (loading) {
    return <CircularProgress color="secondary" />
  }
  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (!data) {
    return <div>no data</div>
  }

  const completions =
    data.completionsPaginated?.edges
      ?.map((edge) => edge?.node)
      .filter(notEmpty) ?? []
  const startCursor = data.completionsPaginated?.pageInfo?.startCursor
  const endCursor = data.completionsPaginated?.pageInfo?.endCursor

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
      hasPrevious={
        data.completionsPaginated?.pageInfo?.hasPreviousPage ?? false
      }
      hasNext={data.completionsPaginated?.pageInfo?.hasNextPage ?? false}
      // pageNumber={queryDetails.page}
    />
  )
}

export default CompletionsList
