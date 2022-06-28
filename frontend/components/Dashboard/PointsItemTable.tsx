import PointsListItemTableChart from "/components/Dashboard/PointsListItemTableChart"
import { formattedGroupPointsDictionary } from "/util/formatPointsData"

interface TableProps {
  studentPoints: formattedGroupPointsDictionary["groups"]
  showDetailedBreakdown: boolean
  cutterValue: number
}

function PointsItemTable(props: TableProps) {
  const { studentPoints, showDetailedBreakdown, cutterValue } = props
  return (
    <>
      {Object.keys(studentPoints)
        .sort()
        .map(function (key) {
          return (
            <PointsListItemTableChart
              key={key}
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
