import { useState } from "react"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { CardSubtitle, CardTitle } from "/components/Text/headers"
import { ProgressUserCourseProgressFragment } from "/graphql/fragments/userCourseProgress"
import { ProgressUserCourseServiceProgressFragment } from "/graphql/fragments/userCourseServiceProgress"
import { UserCourseProgressFragment } from "/static/types/generated/UserCourseProgressFragment"
import { UserCourseServiceProgressFragment } from "/static/types/generated/UserCourseServiceProgressFragment"
import { UserPoints_currentUser_progresses_course } from "/static/types/generated/UserPoints"
import formatPointsData, {
  formattedGroupPointsDictionary,
} from "/util/formatPointsData"

import { gql } from "@apollo/client"
import styled from "@emotion/styled"
import { Grid } from "@mui/material"

import PointsItemTable from "./PointsItemTable"

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
      ...ProgressUserCourseProgressFragment
      ...ProgressUserCourseServiceProgressFragment
    }
  }
  ${ProgressUserCourseProgressFragment}
  ${ProgressUserCourseServiceProgressFragment}
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
  course?: UserPoints_currentUser_progresses_course | null
  userCourseProgress?: UserCourseProgressFragment | null
  userCourseServiceProgresses?: UserCourseServiceProgressFragment[] | null
  cutterValue?: number
  showPersonalDetails?: boolean
  personalDetails?: PersonalDetails
  showProgress?: boolean
}

function PointsListItemCard(props: Props) {
  const {
    course,
    userCourseProgress,
    userCourseServiceProgresses,
    cutterValue = 0,
    showPersonalDetails,
    personalDetails,
    showProgress = true,
  } = props
  const [showDetails, setShowDetails] = useState(false)

  const formattedPointsData: formattedGroupPointsDictionary = formatPointsData({
    userCourseProgress,
    userCourseServiceProgresses,
  })

  return (
    <Root item sm={12} lg={12}>
      {showPersonalDetails && personalDetails ? (
        <PersonalDetailsDisplay personalDetails={personalDetails} />
      ) : (
        <CardTitle component="h2" variant="h3">
          {course?.name}
        </CardTitle>
      )}
      {Object.keys(formattedPointsData?.groups ?? {}).length ? (
        <>
          {showProgress ? (
            <>
              <PointsProgress
                percentage={formattedPointsData.total * 100}
                title="Total progress"
              />
              <PointsProgress
                percentage={formattedPointsData.exercises * 100}
                title="Exercises completed"
              />
              <hr />
            </>
          ) : null}
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
