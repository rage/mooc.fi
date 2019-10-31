import React from "react"
import { formattedGroupPointsDictionary } from "/util/formatPointsData"
import PointsListItemTableChart from "/components/Dashboard/PointsListItemTableChart"

interface TableProps {
  studentPoints: formattedGroupPointsDictionary
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
