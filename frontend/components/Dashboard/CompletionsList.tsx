import { useContext, useState } from "react"

import { useQuery } from "@apollo/client/react"
import { CircularProgress } from "@mui/material"

import CompletionsListWithData from "./CompletionsListWithData"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import CourseLanguageContext from "/contexts/CourseLanguageContext"
import { useQueryParameter } from "/hooks/useQueryParameter"

import {
  PaginatedCompletionsDocument,
  PaginatedCompletionsPreviousPageDocument,
} from "/graphql/generated"

interface CompletionsListProps {
  search?: string
}

interface QueryDetails {
  start?: string | null
  end?: string | null
  back: boolean
  page: number
}

const undefinedIfEmpty = (value?: string) => (value !== "" ? value : undefined)

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
    ? PaginatedCompletionsPreviousPageDocument
    : PaginatedCompletionsDocument

  const cursor = queryDetails.back ? queryDetails.end : queryDetails.start

  const variables = {
    cursor,
    course,
    completionLanguage: undefinedIfEmpty(completionLanguage),
    search: undefinedIfEmpty(search),
  }

  const { data, loading, error } = useQuery(query, {
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

  const completions = (data.completionsPaginated?.edges ?? []).map(
    (edge) => edge?.node,
  )

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
