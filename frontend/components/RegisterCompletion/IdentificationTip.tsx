import { styled } from "@mui/material/styles"

import { Notice, NoticeText } from "/components/ImportantNotice"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

export const EIDAS_IDENTIFICATION_URL =
  "https://www.suomi.fi/instructions-and-support/identification/information-on-identification-tokens-used-in-suomi-fi-e-identification/using-the-identification-tokens-of-other-european-countries-in-finland"
export const SUOMI_FI_IDENTIFICATION_URL =
  "https://www.suomi.fi/instructions-and-support/identification/information-on-identification-tokens-used-in-suomi-fi-e-identification"

const TipText = styled(NoticeText)`
  /* The link text is the full suomi.fi address, which is longer than the notice is wide. */
  a {
    overflow-wrap: anywhere;
  }
` as typeof NoticeText

interface IdentificationTipProps {
  identification: "eidas" | "other_suomi_fi"
}

/** How to reach the chosen identification method once the student is in Sisu. */
function IdentificationTip({ identification }: IdentificationTipProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [translationKey, url] =
    identification === "eidas"
      ? (["identificationEidasTip", EIDAS_IDENTIFICATION_URL] as const)
      : ([
          "identificationOtherSuomiFiTip",
          SUOMI_FI_IDENTIFICATION_URL,
        ] as const)

  return (
    <Notice>
      <TipText
        dangerouslySetInnerHTML={{ __html: t(translationKey, { url }) }}
      />
    </Notice>
  )
}

export default IdentificationTip
