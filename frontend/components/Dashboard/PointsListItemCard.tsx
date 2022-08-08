import { useState } from "react"

import styled from "@emotion/styled"
import { Grid } from "@mui/material"

import PointsItemTable from "./PointsItemTable"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { CardSubtitle, CardTitle } from "/components/Text/headers"
import {
  CourseCoreFieldsFragment,
  UserCourseProgressCoreFieldsFragment,
  UserCourseServiceProgressCoreFieldsFragment,
} from "/static/types/generated"
import formatPointsData from "/util/formatPointsData"

const Root = styled(Grid)`
  background-color: white;
  margin: 1rem;
  padding: 1rem;
`

interface PersonalDetails {
  firstName: string
  lastName: string
  email: string
  sid: string
}
interface PointsListItemCardProps {
  course?: CourseCoreFieldsFragment | null
  userCourseProgress?: UserCourseProgressCoreFieldsFragment | null
  userCourseServiceProgresses?:
    | UserCourseServiceProgressCoreFieldsFragment[]
    | null
  cutterValue?: number
  showPersonalDetails?: boolean
  personalDetails?: PersonalDetails
  showProgress?: boolean
}
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
function PointsListItemCard(props: PointsListItemCardProps) {
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

  const formattedPointsData = formatPointsData({
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
      {showProgress && (
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
        </>
      )}
      {Object.keys(formattedPointsData?.groups ?? {}).length ? (
        <>
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

export default PointsListItemCard
