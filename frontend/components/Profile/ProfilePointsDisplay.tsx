import { useQuery } from "@apollo/client"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import PointsListGrid from "/components/User/Points/PointsListGrid"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { CurrentUserProgressesDocument } from "/graphql/generated"

const ProfilePointsDisplay = () => {
  const { data, error, loading } = useQuery(CurrentUserProgressesDocument)
  const t = useTranslator(ProfileTranslations)
  const isOld = useIsOld()

  if (loading) {
    return <Spinner />
  }

  if (error ?? !data) {
    return <ErrorMessage />
  }

  if (!data?.currentUser?.progresses) {
    return <></>
  }

  return (
    <>
      <PointsListGrid data={data} showOnlyTen />
      <FormSubmitButton
        href={isOld ? "/_old/profile/points" : "/profile/points"}
        variant="text"
        fullWidth
      >
        {t("seePoints")}
      </FormSubmitButton>
    </>
  )
}

export default ProfilePointsDisplay
