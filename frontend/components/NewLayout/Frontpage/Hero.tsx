import Image from "next/image"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CTAButton from "../Common/CTAButton"
// import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import HomeTranslations from "/translations/home"

const HeroRoot = styled("section")(
  ({ theme }) => `
  position: relative;
  padding-bottom: 0;

  ${theme.breakpoints.up("md")} {
    margin-top: 0;
    margin-bottom: 32px;
    padding-bottom: 48px;
    padding-top: 40px;
  }
  ${theme.breakpoints.up("lg")} {
    margin-right: -32px;
    margin-left: -32px;
    max-width: none;
  }

  &::after {
    width: 100%;
    background-color: ${theme.palette.common.grayscale.mediumDark};
    height: 1px;
    content: "";
    margin: 0 auto;
    display: block;

    ${theme.breakpoints.up("md")} {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
`,
)

const HeroContainer = styled("div")(
  ({ theme }) => `
  position: relative;
  
  ${theme.breakpoints.up("md")} {
    display: flex;
    position: relative;
  }
`,
)

const HeroImageContainer = styled("div")(
  ({ theme }) => `
  background-position: 50% 50%;
  background-size: cover;
  background: transparent;
  margin: 0;
  padding: 0;
  position: relative;

  figure {
    margin: 0;
  }
  ${theme.breakpoints.up("md")} {
    background-color: ${theme.palette.common.grayscale.white};
    bottom: 0;
    order: 2;
    padding: 8px 0;
    position: absolute;
    right: 0;
    top: 0;
}
`,
)

const HeroImage = styled(Image)`
  display: block;
  height: 100%;
  min-height: 205px;
  object-fit: contain;
  width: 100%;
`

const HeroContentContainer = styled("div")(
  ({ theme }) => `
  padding: 24px 1rem 40px;
  margin: 0 auto;
  width: 100%;
  
  ${theme.breakpoints.up("xs")} {
    padding: 24px 2rem 40px;
  }
  ${theme.breakpoints.up("md")} {
    order: 2;
    align-items: center;
    display: flex;
    min-height: 330px;
    padding: 56px 2rem;
  }
  ${theme.breakpoints.up(1060)} {
    min-height: 373px;
  }
  ${theme.breakpoints.up(1160)} {
    min-height: 480px;
  }
  ${theme.breakpoints.up("lg")} {
    padding-left: 32px;
    padding-right: 8px;
  }
  ${theme.breakpoints.up(1260)} {
    min-height: 443px;
  }
  ${theme.breakpoints.up(1280)} {
    max-width: 1216px;
    padding-left: 0;
  }
  ${theme.breakpoints.up(1360)} {
    min-height: 478px;
  }
  ${theme.breakpoints.up(1460)} {
    min-height: 513px;
  }
  ${theme.breakpoints.up(1560)} {
    min-height: 548px;
  }
  ${theme.breakpoints.up("xl")} {
    padding-left: 0;
  }
  ${theme.breakpoints.up(1660)} {
    min-height: 583px;
  }
  ${theme.breakpoints.up(1760)} {
    min-height: 619px;
  }
  ${theme.breakpoints.up(1860)} {
    min-height: 654px;
  }
  ${theme.breakpoints.up(1920)} {
    min-height: 675px;
  }
  background-color: ${theme.palette.common.grayscale.white}; 
`,
)

const HeroContent = styled("div")(
  ({ theme }) => `
  position: relative;

  ${theme.breakpoints.up("md")} {
    padding-right: 24px;
    max-width: 50%;
  }
`,
)

const HeroSpacer = styled("div")(
  ({ theme }) => `
  display: none;

  ${theme.breakpoints.up("md")} {
    background-color: ${theme.palette.common.grayscale.white};
    display: block;
    order: 1;
    position: absolute;
    inset: 0;
    width: 50%;
  }
`,
)

const Title = styled(Typography)(
  ({ theme }) => `
  hyphens: auto;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 100%;
  width: auto;

  ${fontSize(32, 38)}
  font-weight: 700;
  color: ${theme.palette.common.grayscale.black};
  letter-spacing: -0.8px;
  margin-bottom: 0;
  text-transform: uppercase;

  ${theme.breakpoints.up("desktop")} {
    ${fontSize(46, 54)}
    letter-spacing: -1.15px;
  }
  ${theme.breakpoints.up("xl")} {
    ${fontSize(52, 60)}
    letter-spacing: -1.5px;
  }
`,
)

const Description = styled("p")(
  ({ theme }) => `
  ${fontSize(16, 24)}
  margin: 16px 0 0 0;
  padding: 0;
  position: relative;
  color: ${theme.palette.common.grayscale.black};

  ${theme.breakpoints.up("xl")} {
    ${fontSize(17, 26)}
  }
`,
)

const ActionContainer = styled("div")`
  margin-top: 24px;
`

const CourseButton = styled(CTAButton)`
  margin-top: 2rem;
`

function Hero() {
  const t = useTranslator(HomeTranslations)
  return (
    <HeroRoot>
      <HeroContainer>
        <HeroImageContainer>
          <HeroImage
            src="/images/new/doggos.png"
            width={620}
            height={465}
            priority
            alt="hero"
          />
        </HeroImageContainer>
        <HeroSpacer />
        <HeroContentContainer>
          <HeroContent>
            <Title variant="h2">{t("tagLine")}</Title>
            <Description>{t("intro")}</Description>
            <ActionContainer>
              <CourseButton variant="hero-white" href="#courses">
                {t("courseButton")}
              </CourseButton>
            </ActionContainer>
          </HeroContent>
        </HeroContentContainer>
      </HeroContainer>
    </HeroRoot>
  )
}

export default Hero
