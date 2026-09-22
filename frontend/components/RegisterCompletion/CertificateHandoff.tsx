import {
  CallToActionButton,
  InstructionsSection,
  Prose,
  QuestionText,
} from "./styles"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

interface CertificateHandoffProps {
  courseSlug: string
}

/**
 * Hands the student off to the certificate page, which knows whether this course can actually
 * produce one and falls back to pointing at the course materials when it can't.
 */
function CertificateHandoff({ courseSlug }: CertificateHandoffProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <InstructionsSection>
      <QuestionText as="h2">{t("certificateHandoffHeading")}</QuestionText>
      <Prose>{t("certificateHandoffBody")}</Prose>
      <CallToActionButton
        variant="contained"
        color="primary"
        size="medium"
        href={`/register-completion/${courseSlug}/certificate`}
      >
        {t("goToCertificate")}
      </CallToActionButton>
    </InstructionsSection>
  )
}

export default CertificateHandoff
