import { useState } from "react"
import { Grid } from "@material-ui/core"
import { UserPoints_currentUser_progresses as ProgressData } from "/static/types/generated/UserPoints"
import PointsItemTable from "./PointsItemTable"
import styled from "@emotion/styled"
import { gql } from "@apollo/client"
import formatPointsData, {
  formattedGroupPointsDictionary,
} from "/util/formatPointsData"
import { CardTitle, CardSubtitle } from "/components/Text/headers"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import PointsProgress from "/components/Dashboard/PointsProgress"

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
        exercise_progress {
          total
          exercises
        }
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

interface PersonalDetailsDisplayProps {
  personalDetails: PersonalDetails
}
const PersonalDetailsDisplay = (props: PersonalDetailsDisplayProps) => {
  const { personalDetails } = props
  return (
    <>
      <CardSubtitle>
        Name: {personalDetails.firstName} {personalDetails.lastName}
      </CardSubtitle>
      <CardSubtitle>e-mail: {personalDetails.email}</CardSubtitle>
      <CardSubtitle>student number: {personalDetails.sid}</CardSubtitle>
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
  const {
    pointsAll,
    cutterValue = 0,
    showPersonalDetails,
    personalDetails,
  } = props
  const [showDetails, setShowDetails] = useState(false)

  const formattedPointsData: formattedGroupPointsDictionary = formatPointsData({
    pointsData: pointsAll,
  })

  return (
    <Root item sm={12} lg={12}>
      {showPersonalDetails && personalDetails ? (
        <PersonalDetailsDisplay personalDetails={personalDetails} />
      ) : (
        <CardTitle component="h2" variant="h3">
          {pointsAll.course?.name}
        </CardTitle>
      )}
      {Object.keys(formattedPointsData?.groups ?? {}).length ? (
        <>
          <PointsProgress
            total={formattedPointsData.total * 100}
            title="Total progress"
          />
          <PointsProgress
            total={formattedPointsData.exercises * 100}
            title="Exercises completed"
          />
          <hr />
          <PointsItemTable
            studentPoints={formattedPointsData.groups}
            showDetailedBreakdown={showDetails}
            cutterValue={cutterValue}
          />
          <FormSubmitButton
            variant="text"
            onClick={() => setShowDetails(!showDetails)}
            fullWidth
          >
            {showDetails ? "show less" : "show detailed breakdown"}
          </FormSubmitButton>
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
