import React from "react"
import { Grid, Typography } from "@material-ui/core"
import { UserPoints_currentUser_progresses as ProgressData } from "/static/types/generated/UserPoints"
import PointsItemTable from "./PointsItemTable"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { gql } from "apollo-boost"
import formatPointsData, {
  formattedGroupPointsDictionary,
} from "/util/formatPointsData"

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
interface PersonalDetailsDisplayProps {
  personalDetails: PersonalDetails
}
const PersonalDetailsDisplay = (props: PersonalDetailsDisplayProps) => {
  const { personalDetails } = props
  return (
    <>
      <UserInformation>
        Name: {personalDetails.firstName} {personalDetails.lastName}
      </UserInformation>
      <UserInformation>e-mail: {personalDetails.email}</UserInformation>
      <UserInformation>student number: {personalDetails.sid}</UserInformation>
    </>
  )
}
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

  const formattedPointsData: formattedGroupPointsDictionary | null = formatPointsData(
    {
      pointsData: pointsAll,
    },
  )
  let cuttervalue = 0
  if (cutterValue) {
    cuttervalue = cutterValue
  }

  return (
    <Root item sm={12} lg={12}>
      {showPersonalDetails && personalDetails ? (
        <PersonalDetailsDisplay personalDetails={personalDetails} />
      ) : (
        <CourseName component="h2" variant="body1">
          {pointsAll.course.name}
        </CourseName>
      )}
      {formattedPointsData ? (
        <>
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
        </>
      ) : (
        <p>No points data available</p>
      )}
    </Root>
  )
}

PointsListItemCard.fragments = {
  user: UserFragment,
}

export default PointsListItemCard
