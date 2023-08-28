import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CTAButton from "../Common/CTAButton"
import { BackgroundImage } from "/components/Images/CardBackgroundFullCover"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

const HeroContainer = styled("section")`
  display: flex;
  position: relative;
  height: 80%;
  align-items: center;
`

const HeroContentContainer = styled("div")`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.6);
`

const Title = styled(Typography)`
  padding: 2rem;
  max-width: 80vw;
  text-align: center;
`
const Paragraph = styled(Typography)`
  max-width: 60vw;
  text-align: center;
`

const CourseButton = styled(CTAButton)`
  margin-top: 2rem;
`

function HeroContent() {
  const t = useTranslator(HomeTranslations)

  return (
    <HeroContentContainer>
      <Title variant="h1">{t("tagLine")}</Title>
      <Paragraph variant="subtitle1">{t("intro")}</Paragraph>
      <CourseButton variant="hero-white" href="#courses">
        {t("courseButton")}
      </CourseButton>
    </HeroContentContainer>
  )
}

function Hero() {
  return (
    <HeroContainer>
      <HeroContent />
      <BackgroundImage
        src="/images/new/hero.png"
        fill
        aria-hidden
        alt="background image"
        priority
      />
    </HeroContainer>
  )
}

export default Hero
