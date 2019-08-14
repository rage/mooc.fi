import React from "react"
import { Typography, Grid } from "@material-ui/core"

import { UserCourseSettingses_UserCourseSettingses_edges_node as UserPointsData } from "../../static/types/generated/UserCourseSettingses"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progressess as UserProgressData } from "../../static/types/generated/UserCourseSettingses"
import {
  pointsDataByGroup,
  serviceData,
} from "../../static/types/PointsByService"

import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

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
  pointsAll: UserProgressData
}

function FormatStudentProgressServiceData(props: FormatProps) {
  const { pointsAll } = props

  let formattedPointsData: pointsDataByGroup[] = []
  //@ts-ignore
  pointsAll.progress.map(p => {
    let ServiceData: serviceData[] = []
    if (pointsAll.user_course_service_progresses) {
      ServiceData = pointsAll.user_course_service_progresses.map(ucsp => {
        const ServiceDataByGroup: serviceData = {
          service: ucsp.service.name,
          //@ts-ignore
          points: ucsp.progress.find(u => u.group === p.group),
        }
        return ServiceDataByGroup
      })
    }

    const newFormattedProgress = {
      group: p.group,
      summary_max_points: p.max_points,
      summary_n_points: p.n_points,
      services: ServiceData,
    }
    formattedPointsData = formattedPointsData.concat(newFormattedProgress)
  })

  return formattedPointsData
}
interface Props {
  studentPointsPerGroup: UserPointsData
}

function PointsListItemCard(props: Props) {
  const { studentPointsPerGroup } = props
  const [showDetails, setShowDetails] = React.useState(false)

  let firstName: string = studentPointsPerGroup!.user!.first_name! || "n/a"
  let lastName: string = studentPointsPerGroup!.user!.last_name! || "n/a"
  let email: string =
    studentPointsPerGroup!.user!.email! || "no email available"
  let studentId: string =
    studentPointsPerGroup!.user!.student_number! || "no SID"
  let studentProgressData: UserProgressData = studentPointsPerGroup!.user!
    .user_course_progressess!
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

      {studentProgressData ? (
        <PointsItemTable
          studentPoints={formattedPointsByService}
          showDetailedBreakdown={showDetails}
        />
      ) : (
        <p>No points data available</p>
      )}
    </Root>
  )
}

export default PointsListItemCard
