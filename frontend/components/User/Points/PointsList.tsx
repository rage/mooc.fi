import React from "react"
import { UserPointsQuery } from "./PointsQuery"
import { useQuery } from "@apollo/react-hooks"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import PointsListGrid from "./PointsListGrid"
import NoPointsErrorMessage from "./NoPointsErrorMessage"

interface StudentHasPointsProps {
  pointsData: UserPointsData
}
export function StudentHasPoints(props: StudentHasPointsProps) {
  const { pointsData } = props
  if (pointsData.currentUser && pointsData.currentUser.progresses) {
    return true
  } else {
    return false
  }
}
interface Props {
  showOnlyTen?: boolean
}

function PointsList(props: Props) {
  const { data, error, loading } = useQuery<UserPointsData>(UserPointsQuery)
  const { showOnlyTen } = props
  if (error) {
    return <ErrorMessage />
  }
  if (loading || !data) {
    return <Spinner />
  }
  const studentHasPoints = StudentHasPoints({ pointsData: data })
  if (studentHasPoints) {
    return (
      <PointsListGrid data={data} showOnlyTen={showOnlyTen ? true : false} />
    )
  } else {
    return <NoPointsErrorMessage />
  }
}

export default PointsList
