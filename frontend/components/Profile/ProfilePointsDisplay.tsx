import React, { useContext } from "react"
import { UserPointsQuery } from "/components/User/Points/PointsQuery"
import { UserPoints as UserPointsData } from "/static/types/generated/UserPoints"
import { useQuery } from "@apollo/react-hooks"
import ErrorMessage from "/components/ErrorMessage"
import Spinner from "/components/Spinner"
import { studentHasPoints } from "/components/User/Points/PointsList"
import PointsListGrid from "/components/User/Points/PointsListGrid"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import LangLink from "../LangLink"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"

const ProfilePointsDisplay = () => {
  const { data, error, loading } = useQuery<UserPointsData>(UserPointsQuery)
  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)

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
        <LangLink
          href="/[lng]/profile/points"
          as={`/${lng.language}/profile/points`}
        >
          <FormSubmitButton variant="text" fullWidth>
            <a href={`/${lng.language}/profile/points`}>{t("seePoints")}</a>
          </FormSubmitButton>
        </LangLink>
      </>
    )
  } else {
    return <></>
  }
}

export default ProfilePointsDisplay
