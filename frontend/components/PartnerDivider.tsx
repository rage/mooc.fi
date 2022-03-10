import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

import styled from "@emotion/styled"
import { Typography } from "@mui/material"

const PartnerDividerText = styled((props: any) => (
  <Typography variant="h4" {...props} />
))`
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

const PartnerDividerWrapper = styled.section`
  width: 100%;
  padding-left: 24px;
`

function PartnerDivider({ ...props }: any) {
  const t = useTranslator(CommonTranslations)

  return (
    <PartnerDividerWrapper {...props}>
      <PartnerDividerText>
        <span>{t("partners")}</span>
      </PartnerDividerText>
    </PartnerDividerWrapper>
  )
}

export default PartnerDivider
