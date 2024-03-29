import { EnhancedLinkProps, Grid, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"
import OutboundLink, { OutboundLinkTextStyle } from "/components/OutboundLink"
import { ShadowedDiv } from "/components/Surfaces/ClickableCard"
import { CardTitle } from "/components/Text/headers"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const NaviItemBase = styled(ShadowedDiv)`
  width: 100%;
  height: 100%;
  max-height: 160px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-start;

  @media (max-width: 600px) {
    max-height: 200px;
  }
`

const InfoGrid = styled("div")`
  width: 80%;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 800px) {
    width: 90%;
  }
`

const FlagBackground = styled(FullCoverTextBackground)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 100%;
  padding: 1rem;
  background-color: #ffd700;
  z-index: 2;
  background-image: linear-gradient(-90deg, transparent, white 28%),
    linear-gradient(180deg, #0057b7 50%, #ffd700 50%);
  background-repeat: no-repeat;
  gap: 1rem;
`

// @ts-ignore: not used for now
const WaveOverlay = styled("div")`
  overflow: hidden;
  &:after {
    z-index: -1;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, white 45%),
      linear-gradient(
        60deg,
        rgba(0, 0, 0, 0.35) 0%,
        hsla(0, 0%, 100%, 0.35) 15%,
        rgba(0, 0, 0, 0.25) 30%,
        rgba(255, 255, 255, 0.15) 45%,
        rgba(0, 0, 0, 0.15) 60%,
        rgba(255, 255, 255, 0.25) 75%,
        rgba(0, 0, 0, 0.15) 90%
      );
  }
`

const InfoContainer = styled("div")`
  display: grid;
  grid-template-rows: 1fr 1fr;
  z-index: 1;
  padding: 0rem;

  a {
    font-size: clamp(12px, 1.5vw, 18px);
  }
  h3 {
    font-size: clamp(18px, 2vw, 24px);
  }
`

const InfoTitle = styled(CardTitle)`
  margin-top: 0;
  text-wrap: balance;
` as typeof CardTitle

const OutboundLinkText = styled(Typography)`
  ${OutboundLinkTextStyle.styles}
` as typeof Typography

const UkraineLink = ({
  children,
  ...props
}: React.PropsWithChildren<EnhancedLinkProps>) => (
  <OutboundLink skipLinkStyling {...props}>
    <OutboundLinkText>{children}</OutboundLinkText>
  </OutboundLink>
)

function UkraineInfo() {
  const t = useTranslator(CommonTranslations)

  return (
    <Grid item xs={12}>
      <NaviItemBase>
        <FlagBackground>
          <InfoGrid>
            <InfoContainer>
              <InfoTitle component="h3" variant="h3">
                {t("ukraineText")}
              </InfoTitle>
              <UkraineLink href={t("ukraineLink")}>
                {t("ukraineLinkText")}
              </UkraineLink>
            </InfoContainer>
            <InfoContainer>
              <InfoTitle component="h3" variant="h3">
                {t("ukraineHyText")}
              </InfoTitle>
              <UkraineLink href={t("ukraineHyLink")}>
                {t("ukraineHyLinkText")}
              </UkraineLink>
            </InfoContainer>
          </InfoGrid>
        </FlagBackground>
      </NaviItemBase>
    </Grid>
  )
}
export default UkraineInfo
