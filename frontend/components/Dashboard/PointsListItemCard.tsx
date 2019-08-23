import React from "react"
import { Typography, Grid } from "@material-ui/core"

import { UserCourseSettingses_UserCourseSettingses_edges_node as UserPointsData } from "/static/types/generated/UserCourseSettingses"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses as UserProgressData } from "/static/types/generated/UserCourseSettingses"
import { pointsDataByGroup, serviceData } from "/static/types/PointsByService"
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

  pointsAll.map(oneUCP => {
    //create a list of groups userCourseProgress has data for
    const groups = oneUCP.progress.map((p: any) => p.group)

    //for all groups found
    formattedPointsData = groups.map((g: string) => {
      //find points for that group from the progress object
      const summaryPoints = oneUCP.progress.filter((p: any) => p.group === g)
      //find all services userCourseProgress has data from
      const serviceData = oneUCP.user_course_service_progresses || []
      //if services found
      let ServiceDataByWeek: serviceData[] = []
      if (serviceData.length > 0) {
        //create a list containing a service data object for each service
        ServiceDataByWeek = serviceData.map(s => {
          //find points data from that service for the group
          const dataForOneServiceForGroup = s.progress.filter(
            (p: any) => p.group === g,
          )
          //create a new service data object
          const newSD = {
            service: s.service.name,
            points: {
              group: g,
              n_points: dataForOneServiceForGroup[0].n_points,
              max_points: dataForOneServiceForGroup[0].max_points,
              progress: dataForOneServiceForGroup[0].progress,
            },
          }
          return newSD
        })
      }
      //create a PointsByService data object from the points and the service data list
      const newFormattedPointsDatum = {
        group: g,
        summary_max_points: summaryPoints[0].max_points,
        summary_n_points: summaryPoints[0].n_points,
        progress: summaryPoints[0].progress,
        services: ServiceDataByWeek,
      }
      return newFormattedPointsDatum
    })
  })
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
      {formattedPointsByService.length !== 0 ? (
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
