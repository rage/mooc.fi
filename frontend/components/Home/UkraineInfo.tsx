import styled from "@emotion/styled"
import { Grid } from "@mui/material"

import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"
import OutboundLink from "/components/OutboundLink"
import { ShadowedDiv } from "/components/Surfaces/ClickableCard"
import { CardTitle } from "/components/Text/headers"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const NaviItemBase = styled(ShadowedDiv)`
  width: 100%;
  height: 100%;
  max-height: 100px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-start;

  @media (max-width: 600px) {
    max-height: 200px;
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
  background-image: linear-gradient(-90deg, transparent, white 40%),
    linear-gradient(180deg, #0057b7 50%, #ffd700 50%);
  background-repeat: no-repeat;
`

// @ts-ignore: not used for now
const WaveOverlay = styled.div`
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
        rgba(255, 255, 255, 0.35) 15%,
        rgba(0, 0, 0, 0.25) 30%,
        rgba(255, 255, 255, 0.15) 45%,
        rgba(0, 0, 0, 0.15) 60%,
        rgba(255, 255, 255, 0.25) 75%,
        rgba(0, 0, 0, 0.15) 90%
      );
  }
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
  max-width: 70%;
`

function UkraineInfo() {
  const t = useTranslator(CommonTranslations)

  return (
    <Grid item xs={12}>
      <NaviItemBase>
        <FlagBackground>
          <InfoContainer>
            <CardTitle component="h3" variant="h3" style={{ marginTop: 0 }}>
              {t("ukraineText")}
            </CardTitle>
            <OutboundLink eventLabel="custom: ukraina" to={t("ukraineLink")}>
              {t("ukraineLinkText")}
            </OutboundLink>
          </InfoContainer>
        </FlagBackground>
      </NaviItemBase>
    </Grid>
  )
}
export default UkraineInfo
