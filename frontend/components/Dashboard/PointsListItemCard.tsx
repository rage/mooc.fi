import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { UserCourseSettingses_UserCourseSettingses_edges_node_user_user_course_progresses as StudentPointsData } from "/static/types/generated/UserCourseSettingses"
import { pointsDataByGroup, serviceData } from "/static/types/PointsByService"
import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { gql } from "apollo-boost"

const UserFragment = gql`
  fragment UserPointsFragment on User {
    id
    first_name
    last_name
    email
    student_number
    user_course_progresses {
      id
      course {
        id
        name
      }
      progress
      user_course_service_progresses {
        course {
          id
          name
        }
        service {
          id
          name
        }
        progress
      }
    }
  }
`

const Root = styled(Grid)`
  background-color: white;
  margin: 1rem;
  padding: 1rem;
`

interface FormatProps {
  pointsAll: StudentPointsData
}
//@ts-ignore
function FormatStudentProgressServiceData(props: FormatProps) {
  const { pointsAll } = props
  let formattedPointsData: pointsDataByGroup[]

  //create a list of groups userCourseProgress has data for
  const groups = pointsAll.progress.map((p: any) => p.group)

  //for all groups found
  formattedPointsData = groups.map((g: string) => {
    //find points for that group from the progress object
    const summaryPoints = pointsAll.progress.filter((p: any) => p.group === g)
    //find all services userCourseProgress has data from
    const serviceData = pointsAll.user_course_service_progresses || []
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

  return formattedPointsData
}
const Name = styled(Typography)`
  font-weight: bold;
`

const UserInformation = styled(Typography)`
  color: gray;
`
interface Props {
  studentPoints?: StudentPointsData | null
  name?: string
  SID?: string | null | undefined
  email?: string
  cutterValue: number
}

function PointsListItemCard(props: Props) {
  const { studentPoints, name, SID, email, cutterValue } = props
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <Root item sm={12} lg={12}>
      <Name>{name}</Name>
      <UserInformation>{email}</UserInformation>
      <UserInformation>{SID}</UserInformation>
      {studentPoints && (
        <PointsItemTable
          studentPoints={FormatStudentProgressServiceData({
            pointsAll: studentPoints,
          })}
          showDetailedBreakdown={showDetails}
          cutterValue={cutterValue}
        />
      )}
      <Button
        variant="text"
        onClick={() => setShowDetails(!showDetails)}
        fullWidth
      >
        {showDetails ? "show less" : "show detailed breakdown"}
      </Button>
    </Root>
  )
}

PointsListItemCard.fragments = {
  user: UserFragment,
}

export default PointsListItemCard
