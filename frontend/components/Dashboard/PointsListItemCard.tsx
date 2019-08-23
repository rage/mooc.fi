import React from "react"
import { Typography, Grid } from "@material-ui/core"

import { UserCourseSettingses_UserCourseSettingses_edges_node as UserPointsData } from "/static/types/generated/UserCourseSettingses"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses as UserProgressData } from "/static/types/generated/UserCourseSettingses"
//@ts-ignore
import { pointsDataByGroup, serviceData } from "/static/types/PointsByService"
//@ts-ignore
import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import _ from "lodash"

const Name = styled(Typography)`
  font-weight: bold;
`
const UserInformation = styled(Typography)`
  color: gray;
`

const Root = styled(Grid)`
  background-color: white;
  margin: 1rem;
  padding: 1rem;
`
interface FormatProps {
  pointsAll: UserProgressData[]
}

function FormatStudentProgressServiceData(props: FormatProps) {
  const { pointsAll } = props
  let formattedPointsData: pointsDataByGroup[] = []
  //@ts-ignore
  const progressByWeek = pointsAll.map(oneUCP => {
    //@ts-ignore
    const groups = oneUCP.progress.map(p => p.group)
    //@ts-ignore
    formattedPointsData = groups.map(g => {
      //@ts-ignore
      const summaryPoints = oneUCP.progress.filter(p => p.group === g)
      const serviceData = oneUCP.user_course_service_progresses || []
      if (serviceData) {
      }
      const newFormattedPointsDatum = {
        group: g,
        summary_max_points: summaryPoints[0].max_points,
        summary_n_points: summaryPoints[0].n_points,
        progress: summaryPoints[0].progress,
      }
      return newFormattedPointsDatum
    })
  })
  console.log(formattedPointsData)
  return formattedPointsData
}
interface Props {
  studentPointsPerGroup: UserPointsData
}

function PointsListItemCard(props: Props) {
  const { studentPointsPerGroup } = props
  const [showDetails, setShowDetails] = React.useState(false)
  const user = studentPointsPerGroup.user

  const firstName = user.first_name || "n/a"
  const lastName = user.last_name || "n/a"
  const email = user.email || "no email available"
  const studentId = user.student_number || "no SID"
  const studentProgressData = user.user_course_progresses! || []
  //@ts-ignore
  const formattedPointsByService = FormatStudentProgressServiceData({
    pointsAll: studentProgressData,
  })

  return (
    <Root item xs={12} sm={12} lg={12}>
      <Button
        variant="text"
        onClick={() => setShowDetails(!showDetails)}
        fullWidth
      >
        {showDetails ? "show less" : "show detailed breakdown"}
      </Button>
      <Name variant="body1" component="h4">
        {firstName} {lastName}
      </Name>
      <UserInformation variant="body1" component="p">
        {email}
      </UserInformation>
      <UserInformation variant="body1" component="p">
        {studentId}
      </UserInformation>
    </Root>
  )
}

export default PointsListItemCard

/*{formattedPointsByService.length !== 0 ? (
        <PointsItemTable
        studentPoints={formattedPointsByService}
        showDetailedBreakdown={showDetails}
      />
      ) : (
        <p>No points data available</p>
      )}*/
