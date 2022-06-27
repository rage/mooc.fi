import { useQuery } from "@apollo/client"
import Link from "next/link"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { studentHasPoints } from "/components/User/Points/PointsList"
import PointsListGrid from "/components/User/Points/PointsListGrid"
import { UserPointsQuery } from "/components/User/Points/PointsQuery"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import ProfileTranslations from "/translations/profile"
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

  if (!hasPoints) {
    return <></>
  }

  return (
    <>
      <PointsListGrid data={data} showOnlyTen={true} />
      <Link href={`/profile/points`} passHref>
        <FormSubmitButton variant="text" fullWidth>
          {t("seePoints")}
        </FormSubmitButton>
      </Link>
    </>
  )
}

export default ProfilePointsDisplay
