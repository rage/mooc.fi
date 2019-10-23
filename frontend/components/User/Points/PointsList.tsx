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
function StudentHasPoints(props: StudentHasPointsProps) {
  const { pointsData } = props
  if (pointsData.currentUser && pointsData.currentUser.progresses) {
    return true
  } else {
    return false
  }
}

function PointsList() {
  const { data, error, loading } = useQuery<UserPointsData>(UserPointsQuery)
  if (error) {
    return <ErrorMessage />
  }
  if (loading || !data) {
    return <Spinner />
  }
  const studentHasPoints = StudentHasPoints({ pointsData: data })
  if (studentHasPoints) {
    return <PointsListGrid data={data} />
  } else {
    return <NoPointsErrorMessage />
  }
}

export default PointsList
