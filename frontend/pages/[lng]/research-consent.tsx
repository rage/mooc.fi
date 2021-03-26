import { useContext, useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Paper, CircularProgress } from "@material-ui/core"
import LanguageContext from "../../contexts/LanguageContext"
import { useMutation, useQuery } from "@apollo/client"
import ResearchConsent from "/components/Dashboard/ResearchConsent"
import SignupTranslations from "/translations/sign-up"
import { gql } from "@apollo/client"
import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import withSignedIn from "/lib/with-signed-in"
import Router from "next/router"
import { useTranslator } from "/util/useTranslator"

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
`
const Row = styled.div`
  margin-bottom: 1.5rem;
`
const Form = styled.form`
  width: 100%;
`

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const consentQuery = gql`
  query consentQuery {
    currentUser {
      id
      research_consent
    }
  }
`
const updateResearchConsentMutation = gql`
  mutation updateCreateAccountResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

function useResearchConsent() {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(SignupTranslations)

  const { data, loading } = useQuery(consentQuery)

  const [research, setResearch] = useState("")
  const [formError, setFormError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (data?.currentUser?.research_consent) {
      setResearch(data.currentUser.research_consent ? "1" : "0")
    }
  }, [data])

  const [updateConsent] = useMutation(updateResearchConsentMutation)

  const handleInput = (e: any) => setResearch(e.target.value)

  const onSubmit = async () => {
    try {
      setFormError("")
      setSubmitting(true)
      await updateConsent({ variables: { value: research === "1" } })
      Router.push(
        language === "fi" ? "/" : `/[lng]`,
        language === "fi" ? "/" : `/${language}`,
      )
    } catch (e) {
      setSubmitting(false)
      console.log(e)

      setFormError(t("errorResearchSubmit"))
    }
  }

  return {
    data,
    loading,
    research,
    handleInput,
    formError,
    submitting,
    onSubmit,
  }
}

const ResearchConsentPage = () => {
  const t = useTranslator(SignupTranslations)

  const {
    loading,
    research,
    handleInput,
    onSubmit,
    formError,
    submitting,
  } = useResearchConsent()

  return (
    <StyledPaper>
      <Form onSubmit={(e: any) => e.preventDefault()}>
        <ResearchConsent
          state={research}
          disabled={loading}
          handleInput={handleInput}
        />
        <Row>
          <SubmitButton
            onClick={onSubmit}
            disabled={loading || research === ""}
            variant="contained"
            color="secondary"
            fullWidth
            type="submit"
          >
            {submitting ? <CircularProgress size={20} /> : t("submit")}
          </SubmitButton>
        </Row>
      </Form>
      {formError && (
        <InfoBox>
          <b>
            {" "}
            {t("error")} {formError}
          </b>
        </InfoBox>
      )}
    </StyledPaper>
  )
}

export default withSignedIn(ResearchConsentPage)
