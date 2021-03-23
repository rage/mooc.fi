import { useState, ChangeEvent } from "react"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import ResearchConsent from "/components/Dashboard/ResearchConsent"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client"
import CustomSnackbar from "/components/CustomSnackbar"
import { UserOverViewQuery } from "/pages/[lng]/profile"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

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

  const { research_consent } = data || {}

  console.log({ data })
  console.log({ research_consent })
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
  const [snackbarState, setSnackbarState] = useState<SnackbarProps>(
    initialSnackbarState,
  )

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
