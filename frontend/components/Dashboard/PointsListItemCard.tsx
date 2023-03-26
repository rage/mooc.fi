import { useCallback, useMemo, useState } from "react"

import { Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import PointsItemTable from "./PointsItemTable"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import PointsProgress from "/components/Dashboard/PointsProgress"
import { CardSubtitle, CardTitle } from "/components/Text/headers"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import formatPointsData from "/util/formatPointsData"

import {
  CourseCoreFieldsFragment,
  UserCoreFieldsFragment,
  UserCourseProgressCoreFieldsFragment,
  UserCourseServiceProgressCoreFieldsFragment,
} from "/graphql/generated"

const PointsListItemCardContainer = styled(Grid)`
  background-color: white;
  width: 100%;
  padding: 1rem;
`

interface PointsListItemCardProps {
  course?: CourseCoreFieldsFragment | null
  userCourseProgress?: UserCourseProgressCoreFieldsFragment | null
  userCourseServiceProgresses?:
    | UserCourseServiceProgressCoreFieldsFragment[]
    | null
  cutterValue?: number
  showPersonalDetails?: boolean
  user?: UserCoreFieldsFragment
  showProgress?: boolean
}

interface PersonalDetailsDisplayProps {
  user: UserCoreFieldsFragment
}

const PersonalDetailsDisplay = ({ user }: PersonalDetailsDisplayProps) => {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      <CardSubtitle>
        {t("name")} {user.full_name}
      </CardSubtitle>
      <CardSubtitle>
        {t("email")} {user.email ?? "-"}
      </CardSubtitle>
      <CardSubtitle>
        {t("studentNumber")} {user.real_student_number ?? "-"}
      </CardSubtitle>
    </>
  )
}
function PointsListItemCard(props: PointsListItemCardProps) {
  const t = useTranslator(ProfileTranslations)
  const {
    course,
    userCourseProgress,
    userCourseServiceProgresses,
    cutterValue = 0,
    showPersonalDetails,
    user,
    showProgress = true,
  } = props
  const [showDetails, setShowDetails] = useState(false)

  // TODO: do this in the backend
  const formattedPointsData = useMemo(
    () =>
      formatPointsData({
        userCourseProgress,
        userCourseServiceProgresses,
      }),
    [userCourseProgress, userCourseServiceProgresses],
  )

  const onShowDetailsClick = useCallback(
    () => setShowDetails((prev) => !prev),
    [setShowDetails],
  )

  return (
    <PointsListItemCardContainer item xs={12} sm={12} md={12} lg={12}>
      {showPersonalDetails && user ? (
        <PersonalDetailsDisplay user={user} />
      ) : (
        <CardTitle component="h2" variant="h3">
          {course?.name}
        </CardTitle>
      )}
      {showProgress && (
        <>
          <PointsProgress
            percentage={formattedPointsData.total * 100}
            title={t("totalProgress")}
          />
          <PointsProgress
            percentage={formattedPointsData.exercises * 100}
            title={t("exercisesCompleted")}
          />
        </>
      )}
      {Object.keys(formattedPointsData?.groups ?? {}).length > 0 ? (
        <>
          <PointsItemTable
            studentPoints={formattedPointsData.groups}
            showDetailedBreakdown={showDetails}
            cutterValue={cutterValue}
          />
          <FormSubmitButton
            variant="text"
            onClick={onShowDetailsClick}
            fullWidth
          >
            {showDetails ? t("showLess") : t("showDetailedBreakdown")}
          </FormSubmitButton>
        </>
      ) : (
        <p>{t("noPointsData")}</p>
      )}
    </PointsListItemCardContainer>
  )
}

export default PointsListItemCard
