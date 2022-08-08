import { useContext, useState } from "react"

import { useQuery } from "@apollo/client"
import { CircularProgress } from "@mui/material"

import CompletionsListWithData from "./CompletionsListWithData"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import {
  PaginatedCompletionsPreviousPageQuery,
  PaginatedCompletionsQuery,
} from "/graphql/queries/completion"
import {
  PaginatedCompletionsPreviousPageQueryResult,
  PaginatedCompletionsQueryResult,
} from "/static/types/generated"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"

interface CompletionsListProps {
  search?: string
}

interface QueryDetails {
  start?: string | null
  end?: string | null
  back: boolean
  page: number
}

const CompletionsList = ({ search }: CompletionsListProps) => {
  const completionLanguage = useContext(CourseLanguageContext)
  const course = useQueryParameter("slug")

  const [queryDetails, setQueryDetails] = useState<QueryDetails>({
    start: null,
    end: null,
    back: false,
    page: 1,
  })

  const query = queryDetails.back
    ? PaginatedCompletionsPreviousPageQuery
    : PaginatedCompletionsQuery

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
    | PaginatedCompletionsQueryResult
    | PaginatedCompletionsPreviousPageQueryResult
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
        data.completionsPaginated?.pageInfo?.hasPreviousPage || false
      }
      hasNext={data.completionsPaginated?.pageInfo?.hasNextPage || false}
      // pageNumber={queryDetails.page}
    />
  )
}

export default CompletionsList
