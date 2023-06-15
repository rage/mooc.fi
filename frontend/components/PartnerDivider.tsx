import { PropsOf } from "@emotion/react"
import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const PartnerDividerText = styled(Typography)`
  display: block;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  line-height: 0.1em;
  margin-top: 2rem;

  span {
    background-color: #fff;
    padding: 0.5rem;
  }
`

const PartnerDividerWrapper = styled("section")`
  width: 100%;
  padding-left: 24px;
`

function PartnerDivider(props: PropsOf<typeof PartnerDividerWrapper>) {
  const t = useTranslator(CommonTranslations)

  return (
    <PartnerDividerWrapper {...props}>
      <PartnerDividerText variant="h4">
        <span>{t("partners")}</span>
      </PartnerDividerText>
    </PartnerDividerWrapper>
  )
}

export default PartnerDivider
