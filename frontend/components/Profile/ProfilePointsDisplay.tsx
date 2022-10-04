import Link from "next/link"

import { useQuery } from "@apollo/client"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import PointsListGrid from "/components/User/Points/PointsListGrid"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { CurrentUserProgressesDocument } from "/graphql/generated"

const ProfilePointsDisplay = () => {
  const { data, error, loading } = useQuery(CurrentUserProgressesDocument)
  const t = useTranslator(ProfileTranslations)

  if (loading) {
    return <Spinner />
  }

  if (error || !data) {
    return <ErrorMessage />
  }

  if (!data?.currentUser?.progresses) {
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
