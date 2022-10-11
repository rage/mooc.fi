import { ApolloError } from "@apollo/client"

import NoPointsErrorMessage from "./NoPointsErrorMessage"
import PointsListGrid from "./PointsListGrid"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"

import { CurrentUserProgressesQuery } from "/graphql/generated"

interface PointsListProps {
  showOnlyTen?: boolean
  data?: CurrentUserProgressesQuery
  loading: boolean
  error?: ApolloError
}

function PointsList({ data, error, loading, showOnlyTen }: PointsListProps) {
  if (error) {
    return <ErrorMessage />
  }
  if (loading || !data) {
    return <Spinner />
  }

  if (data.currentUser?.progresses) {
    return (
      <PointsListGrid data={data} showOnlyTen={showOnlyTen ? true : false} />
    )
  } else {
    return <NoPointsErrorMessage />
  }
}

export default PointsList
