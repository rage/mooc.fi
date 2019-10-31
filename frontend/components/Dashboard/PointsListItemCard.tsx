import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { UserPoints_currentUser_progresses as ProgressData } from "/static/types/generated/UserPoints"
import { pointsByGroup } from "/static/types/PointsByService"
import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { gql } from "apollo-boost"
import PointsDataFormatter from "/components/User/Points/PointsDataFormatter"

const UserFragment = gql`
  fragment UserPointsFragment on User {
    id
    first_name
    last_name
    email
    student_number
    progresses {
      course {
        name
        id
      }
      user_course_progress {
        progress
        user {
          first_name
          last_name
          username
          email
          real_student_number
        }
      }
      user_course_service_progresses {
        progress
        service {
          name
          id
        }
      }
    }
  }
`

const Root = styled(Grid)`
  background-color: white;
  margin: 1rem;
  padding: 1rem;
`

const UserInformation = styled(Typography)`
  color: gray;
`

const CourseName = styled(Typography)`
  font-weight: bold;
`
interface PersonalDetails {
  firstName: string
  lastName: string
  email: string
  sid: string
}

interface Props {
  pointsAll: ProgressData
  cutterValue?: number
  showPersonalDetails?: boolean
  personalDetails?: PersonalDetails
}
function PointsListItemCard(props: Props) {
  const { pointsAll, cutterValue, showPersonalDetails, personalDetails } = props
  const [showDetails, setShowDetails] = React.useState(false)
  const formattedPointsData: pointsByGroup[] = PointsDataFormatter({
    pointsData: pointsAll,
  })
  let cuttervalue = 0
  if (cutterValue) {
    cuttervalue = cutterValue
  }
  console.log(personalDetails)
  return (
    <Root item sm={12} lg={12}>
      {showPersonalDetails && personalDetails ? (
        <>
          <UserInformation>
            Name: {personalDetails.firstName} {personalDetails.lastName}
          </UserInformation>
          <UserInformation>e-mail: {personalDetails.email}</UserInformation>
          <UserInformation>
            student number: {personalDetails.sid}
          </UserInformation>
        </>
      ) : (
        <CourseName component="h2" variant="body1">
          {pointsAll.course.name}
        </CourseName>
      )}

      <PointsItemTable
        studentPoints={formattedPointsData}
        showDetailedBreakdown={showDetails}
        cutterValue={cuttervalue}
      />
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
