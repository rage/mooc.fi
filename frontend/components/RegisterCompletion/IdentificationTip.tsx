import { Notice, NoticeText } from "/components/ImportantNotice"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

export const EIDAS_IDENTIFICATION_URL =
  "https://www.suomi.fi/instructions-and-support/identification/information-on-identification-tokens-used-in-suomi-fi-e-identification/using-the-identification-tokens-of-other-european-countries-in-finland"
export const SUOMI_FI_IDENTIFICATION_URL =
  "https://www.suomi.fi/instructions-and-support/identification/information-on-identification-tokens-used-in-suomi-fi-e-identification"

interface IdentificationTipProps {
  identification: "eidas" | "other_suomi_fi"
}

/** How to reach the chosen identification method once the student is in Sisu. */
function IdentificationTip({ identification }: IdentificationTipProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const translationKey =
    identification === "eidas"
      ? "identificationEidasTip"
      : "identificationOtherSuomiFiTip"

  return (
    <Notice>
      <NoticeText>{t(translationKey)}</NoticeText>
    </Notice>
  )
}

export default IdentificationTip
