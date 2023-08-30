import { PropsOf } from "@emotion/react"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"

const PartnerDividerText = styled("span")(
  ({ theme }) => `
  ${fontSize(14)}
  color: ${theme.palette.common.grayscale.mediumDark};
  text-transform: uppercase;
  display: block;
  text-align: center;

  margin: 0 auto;
  background-color: ${theme.palette.common.grayscale.white};
  padding: 0 0.5rem;
  z-index: 10;
  left: 50%;
  right: 50%;
`,
)

const PartnerDividerWrapper = styled("section")(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  &::before {
    content: "";
    height: 1px;
    position: absolute;
    left: 0;
    right: 0;
    background-color: ${theme.palette.common.grayscale.mediumDark};
    z-index: 1;
  }
`,
)

function PartnerDivider(props: PropsOf<typeof PartnerDividerWrapper>) {
  const t = useTranslator(CommonTranslations)

  return (
    <PartnerDividerWrapper {...props}>
      <PartnerDividerText>{t("partners")}</PartnerDividerText>
    </PartnerDividerWrapper>
  )
}

export default PartnerDivider
