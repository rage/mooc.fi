import { useQuery } from "@apollo/client"

import NoPointsErrorMessage from "./NoPointsErrorMessage"
import PointsListGrid from "./PointsListGrid"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"

import { CurrentUserProgressesDocument } from "/static/types/generated"

interface PointsListProps {
  showOnlyTen?: boolean
}

function PointsList(props: PointsListProps) {
  const { data, error, loading } = useQuery(CurrentUserProgressesDocument)
  const { showOnlyTen } = props

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
