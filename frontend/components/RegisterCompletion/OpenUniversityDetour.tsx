import { ReactNode, useState } from "react"

import AnswerButtonGroup, { AnswerOption } from "./AnswerButtonGroup"
import CertificateHandoff from "./CertificateHandoff"
import CreditJustificationForm from "./CreditJustificationForm"
import IdentificationTip, {
  EIDAS_IDENTIFICATION_URL,
  SUOMI_FI_IDENTIFICATION_URL,
} from "./IdentificationTip"
import {
  InstructionsSection,
  Prose,
  QuestionSection,
  QuestionText,
} from "./styles"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

import {
  CompletionDetailedFieldsFragment,
  CourseCoreFieldsFragment,
} from "/graphql/generated"

type YesNoAnswer = "yes" | "no"
type RegistrationNeed = "certificate" | "credits"
// Stored as-is by setCreditRegistrationJustification; keep in sync with
// backend/schema/Completion/mutations.ts.
type IdentificationAnswer = "eidas" | "other_suomi_fi" | "none"

interface OpenUniversityDetourProps {
  completion: CompletionDetailedFieldsFragment
  course: CourseCoreFieldsFragment
  renderDestination: () => ReactNode
}

/**
 * The questions that come before the Open University instructions on courses where a certificate
 * is an alternative to registered credits, for students who have no Finnish personal identity code.
 *
 * Every answered question stays on screen; changing one clears the answers that followed it.
 */
function OpenUniversityDetour({
  completion,
  course,
  renderDestination,
}: OpenUniversityDetourProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [hasFinnishIdentityCode, setHasFinnishIdentityCode] =
    useState<YesNoAnswer | null>(null)
  const [need, setNeed] = useState<RegistrationNeed | null>(null)
  const [identification, setIdentification] =
    useState<IdentificationAnswer | null>(null)
  const [needAfterReconsidering, setNeedAfterReconsidering] =
    useState<RegistrationNeed | null>(null)
  const [justificationSaved, setJustificationSaved] = useState(
    Boolean(completion.credit_registration_justification),
  )

  const onFinnishIdentityCodeAnswered = (answer: YesNoAnswer) => {
    setHasFinnishIdentityCode(answer)
    setNeed(null)
    setIdentification(null)
    setNeedAfterReconsidering(null)
  }
  const onNeedAnswered = (answer: RegistrationNeed) => {
    setNeed(answer)
    setIdentification(null)
    setNeedAfterReconsidering(null)
  }
  const onIdentificationAnswered = (answer: IdentificationAnswer) => {
    setIdentification(answer)
    setNeedAfterReconsidering(null)
  }

  const yesNoOptions: AnswerOption<YesNoAnswer>[] = [
    { value: "yes", label: t("yes") },
    { value: "no", label: t("no") },
  ]
  const needOptions: AnswerOption<RegistrationNeed>[] = [
    { value: "certificate", label: t("needCertificateOption") },
    { value: "credits", label: t("needCreditsOption") },
  ]
  const identificationOptions: AnswerOption<IdentificationAnswer>[] = [
    {
      value: "eidas",
      label: t("identificationEidasOption"),
      hint: t("identificationLinkHint", { url: EIDAS_IDENTIFICATION_URL }),
    },
    {
      value: "other_suomi_fi",
      label: t("identificationOtherSuomiFiOption"),
      hint: t("identificationLinkHint", { url: SUOMI_FI_IDENTIFICATION_URL }),
    },
    {
      value: "none",
      label: t("identificationNoneOption"),
      hint: t("identificationNoneHint"),
    },
  ]

  const suomiFiIdentification =
    identification === "eidas" || identification === "other_suomi_fi"
      ? identification
      : null
  const certificateChosen =
    need === "certificate" || needAfterReconsidering === "certificate"
  const showDestination =
    hasFinnishIdentityCode === "yes" ||
    suomiFiIdentification !== null ||
    (needAfterReconsidering === "credits" && justificationSaved)

  return (
    <>
      <QuestionSection>
        <QuestionText>{t("finnishIdQuestion")}</QuestionText>
        <AnswerButtonGroup
          options={yesNoOptions}
          value={hasFinnishIdentityCode}
          onChange={onFinnishIdentityCodeAnswered}
        />
      </QuestionSection>

      {hasFinnishIdentityCode === "no" && (
        <QuestionSection>
          <QuestionText>{t("needQuestionTitle")}</QuestionText>
          <Prose>{t("needQuestionBody")}</Prose>
          <AnswerButtonGroup
            options={needOptions}
            value={need}
            onChange={onNeedAnswered}
          />
        </QuestionSection>
      )}

      {need === "credits" && (
        <QuestionSection>
          <QuestionText>{t("identificationQuestionTitle")}</QuestionText>
          <Prose>{t("identificationQuestionBody")}</Prose>
          <AnswerButtonGroup
            options={identificationOptions}
            value={identification}
            onChange={onIdentificationAnswered}
          />
        </QuestionSection>
      )}

      {suomiFiIdentification && (
        <InstructionsSection>
          <IdentificationTip identification={suomiFiIdentification} />
        </InstructionsSection>
      )}

      {identification === "none" && (
        <QuestionSection>
          <QuestionText>{t("reconsiderTitle")}</QuestionText>
          <Prose>{t("reconsiderBody")}</Prose>
          <AnswerButtonGroup
            options={needOptions}
            value={needAfterReconsidering}
            onChange={setNeedAfterReconsidering}
          />
        </QuestionSection>
      )}

      {identification === "none" && needAfterReconsidering === "credits" && (
        <CreditJustificationForm
          completionId={completion.id}
          identificationAnswer={identification}
          initialJustification={
            completion.credit_registration_justification ?? ""
          }
          onSaved={() => setJustificationSaved(true)}
        />
      )}

      {certificateChosen && (
        <CertificateHandoff course={course} completion={completion} />
      )}

      {showDestination && renderDestination()}
    </>
  )
}

export default OpenUniversityDetour
