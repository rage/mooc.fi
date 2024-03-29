import { ChangeEvent } from "react"

import {
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const Row = styled("div")`
  margin-bottom: 1.5rem;
`

interface ResearchConsentProps {
  state?: string
  handleInput: (event: ChangeEvent<HTMLInputElement>, value: string) => void
  disabled: boolean
}

const ResearchConsent = ({
  state,
  handleInput,
  disabled,
}: ResearchConsentProps) => {
  const t = useTranslator(CommonTranslations)

  return (
    <>
      <h2>{t("researchTitle")}</h2>

      <p>{t("research1")}</p>

      <ol>
        <li>{t("research2")}</li>
        <li>{t("research3")}</li>
        <li>{t("research4")}</li>
      </ol>

      <p>
        {t("research5")}
        <Link
          href="https://dl.acm.org/citation.cfm?id=2858798"
          target="_blank"
          rel="noopener noreferrer"
        >
          Educational Data Mining and Learning Analytics in Programming:
          Literature Review and Case Studies
        </Link>
        .
      </p>

      <p>{t("research6")}</p>

      <p>{t("research7")}</p>

      <Row>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label={t("researchAgree")}
            name="research"
            value={state}
            onChange={handleInput}
          >
            <FormControlLabel
              value="1"
              control={<Radio color="primary" disabled={disabled} />}
              label={t("researchYes")}
            />
            <FormControlLabel
              value="0"
              control={<Radio disabled={disabled} />}
              label={t("researchNo")}
            />
          </RadioGroup>
        </FormControl>
      </Row>
    </>
  )
}

export default ResearchConsent
