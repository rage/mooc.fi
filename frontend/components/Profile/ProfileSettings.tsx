import { ChangeEvent, useState } from "react"

import CustomSnackbar from "/components/CustomSnackbar"
import ResearchConsent from "/components/Dashboard/ResearchConsent"
import { UserOverViewQuery } from "/pages/profile"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { gql, useMutation } from "@apollo/client"

const updateResearchConsentMutation = gql`
  mutation updateUpdateAccountResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

interface ProfileSettingsProps {
  data?: ProfileUserOverView_currentUser
}

interface SnackbarProps {
  type: "error" | "success" | "warning"
  message: string
}

const ProfileSettings = ({ data }: ProfileSettingsProps) => {
  const t = useTranslator(ProfileTranslations)

  const initialSnackbarState: SnackbarProps = {
    type: "success",
    message: t("researchOkAnswer"),
  }

  const { research_consent } = data ?? {}
  const [researchConsent, setResearchConsent] = useState<string | undefined>(
    research_consent === null || typeof research_consent === "undefined"
      ? undefined
      : research_consent
      ? "1"
      : "0",
  )
  const [updateResearchConsent, { loading }] = useMutation(
    updateResearchConsentMutation,
    {
      refetchQueries: [{ query: UserOverViewQuery }],
    },
  )
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [snackbarState, setSnackbarState] =
    useState<SnackbarProps>(initialSnackbarState)

  const handleResearchConsentInput = async (
    event: ChangeEvent<{}>,
    value: string,
  ) => {
    event.preventDefault()
    setResearchConsent(value)
    try {
      await updateResearchConsent({ variables: { value: value === "1" } })
      setSnackbarState(initialSnackbarState)
    } catch {
      setSnackbarState({
        type: "error",
        message: t("researchError"),
      })
    }
    setIsSnackbarOpen(true)
  }

  return (
    <>
      <ResearchConsent
        state={researchConsent}
        disabled={loading}
        handleInput={handleResearchConsentInput}
      />
      <CustomSnackbar
        open={isSnackbarOpen}
        setOpen={setIsSnackbarOpen}
        {...snackbarState}
      />
    </>
  )
}

export default ProfileSettings
