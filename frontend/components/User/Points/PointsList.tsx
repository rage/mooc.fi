import { useQuery } from "@apollo/client"

import NoPointsErrorMessage from "./NoPointsErrorMessage"
import PointsListGrid from "./PointsListGrid"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { CurrentUserProgressesQuery } from "/graphql/queries/user"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"

interface StudentHasPointsProps {
  pointsData: UserPointsData
}
export function studentHasPoints(props: StudentHasPointsProps) {
  const { pointsData } = props

  if (pointsData.currentUser?.progresses) {
    return true
  } else {
    return false
  }
}
interface Props {
  showOnlyTen?: boolean
}

function PointsList(props: Props) {
  const { data, error, loading } = useQuery<UserPointsData>(
    CurrentUserProgressesQuery,
  )
  const { showOnlyTen } = props
  if (error) {
    return <ErrorMessage />
  }
  if (loading || !data) {
    return <Spinner />
  }
  const hasPoints = studentHasPoints({ pointsData: data })

  if (hasPoints) {
    return (
      <PointsListGrid data={data} showOnlyTen={showOnlyTen ? true : false} />
    )
  } else {
    return <NoPointsErrorMessage />
  }
}

export default PointsList
