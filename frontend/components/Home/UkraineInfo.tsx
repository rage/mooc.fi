import { styled } from "@mui/material/styles"

import ContentWrapper from "../NewLayout/Common/ContentWrapper"
import LinkBoxList from "../NewLayout/Common/LinkBoxList"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const StyledContentWrapper = styled(ContentWrapper)`
  margin-top: 5rem;
`

function UkraineInfo() {
  const t = useTranslator(CommonTranslations)

  return (
    <section id="ukraineinfo">
      <StyledContentWrapper>
        <LinkBoxList
          items={[
            {
              title: t("ukraineText"),
              description: "",
              linkProps: {
                href: t("ukraineLink"),
                children: t("ukraineLinkText"),
              },
              ukraine: true,
            },
            {
              title: t("ukraineHyText"),
              description: "",
              linkProps: {
                href: t("ukraineHyLink"),
                children: t("ukraineHyLinkText"),
              },
              ukraine: true,
            },
          ]}
        />
      </StyledContentWrapper>
    </section>
  )
}
export default UkraineInfo
