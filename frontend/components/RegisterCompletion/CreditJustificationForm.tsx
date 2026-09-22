import { useId, useState } from "react"

import { useMutation } from "@apollo/client"
import { Alert, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  CallToActionButton,
  InstructionsSection,
  Prose,
  QuestionText,
} from "./styles"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

import { SetCreditRegistrationJustificationDocument } from "/graphql/generated"

const JustificationField = styled(TextField)`
  max-width: 34rem;
` as typeof TextField

interface CreditJustificationFormProps {
  completionId: string
  identificationAnswer: string
  initialJustification: string
  onSaved: () => void
}

/**
 * Asks why a certificate does not cover the student's need, which is the only record anyone gets
 * of these cases.
 *
 * Saving overwrites whatever was stored before, so answering again is safe.
 */
function CreditJustificationForm({
  completionId,
  identificationAnswer,
  initialJustification,
  onSaved,
}: CreditJustificationFormProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [justification, setJustification] = useState(initialJustification)
  const [saveJustification, { loading, error }] = useMutation(
    SetCreditRegistrationJustificationDocument,
  )
  const fieldId = useId()

  const [saved, setSaved] = useState(Boolean(initialJustification))

  const onSubmit = async () => {
    try {
      await saveJustification({
        variables: {
          id: completionId,
          justification,
          identification_answer: identificationAnswer,
        },
      })
      setSaved(true)
      onSaved()
    } catch {
      // The mutation's error state renders the alert below the field.
    }
  }

  return (
    <InstructionsSection>
      <QuestionText as="h2">{t("justificationTitle")}</QuestionText>
      <Prose>{t("justificationBody")}</Prose>
      <JustificationField
        id={fieldId}
        label={t("justificationLabel")}
        value={justification}
        onChange={(event) => setJustification(event.target.value)}
        inputProps={{ maxLength: 4000 }}
        multiline
        minRows={4}
        required
        fullWidth
      />
      {error && <Alert severity="error">{t("justificationSaveFailed")}</Alert>}
      <CallToActionButton
        variant="contained"
        color="primary"
        size="medium"
        disabled={loading || justification.trim() === ""}
        onClick={onSubmit}
      >
        {saved ? t("updateReason") : t("justificationContinue")}
      </CallToActionButton>
    </InstructionsSection>
  )
}

export default CreditJustificationForm
