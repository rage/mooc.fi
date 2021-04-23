import { UserPointsQuery } from "/components/User/Points/PointsQuery"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import { useQuery } from "@apollo/client"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { studentHasPoints } from "/components/User/Points/PointsList"
import PointsListGrid from "/components/User/Points/PointsListGrid"
import ProfileTranslations from "/translations/profile"
import LangLink from "/components/LangLink"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { useTranslator } from "/util/useTranslator"

const ProfilePointsDisplay = () => {
  const { data, error, loading } = useQuery<UserPointsData>(UserPointsQuery)
  const t = useTranslator(ProfileTranslations)

  if (loading) {
    return <Spinner />
  }

  if (error || !data) {
    return <ErrorMessage />
  }

  const hasPoints = studentHasPoints({ pointsData: data })
  if (hasPoints) {
    return (
      <>
        <PointsListGrid data={data} showOnlyTen={true} />
        <LangLink href={`/profile/points`} passHref>
          <FormSubmitButton variant="text" fullWidth>
            {t("seePoints")}
          </FormSubmitButton>
        </LangLink>
      </>
    )
  } else {
    return <></>
  }
}

export default ProfilePointsDisplay
