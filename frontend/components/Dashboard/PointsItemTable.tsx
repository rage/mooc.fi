import React from "react"
import { pointsByGroup } from "/static/types/PointsByService"
import PointsListItemTableChart from "/components/Dashboard/PointsListItemTableChart"

interface TableProps {
  studentPoints: pointsByGroup[]
  showDetailedBreakdown: boolean
  cutterValue: number
}

function PointsItemTable(props: TableProps) {
  const { studentPoints, showDetailedBreakdown, cutterValue } = props

  return (
    <>
      {Object.keys(studentPoints).map(function(key) {
        return (
          <PointsListItemTableChart
            title={key}
            //@ts-ignore
            points={studentPoints[key]}
            cuttervalue={cutterValue}
            showDetailed={showDetailedBreakdown}
          />
        )
      })}
    </>
  )
}

export default PointsItemTable
