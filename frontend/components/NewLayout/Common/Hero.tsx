import Image, { ImageProps } from "next/image"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CTAButton, { CTAButtonProps } from "./CTAButton"
import { fontSize } from "/src/theme/util"

const HeroSizes = ["large", "small"] as const
const HeroTypes = ["landing", "front_page", "minor_landing"] as const
const HeroColors = ["black", "blue", "white"] as const

export type HeroSize = (typeof HeroSizes)[number]
export type HeroType = (typeof HeroTypes)[number]
export type HeroColor = (typeof HeroColors)[number]

const HeroRoot = styled("section")(
  ({ theme }) => `
  position: relative;
  padding-bottom: 0;

  ${theme.breakpoints.up("md")} {
    margin-top: 32px;
    margin-bottom: 32px;
  }
  ${theme.breakpoints.up("xl")} {
    max-width: 1216px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero__white {
    ${theme.breakpoints.up("md")} {
      margin-top: 0;
      padding-bottom: 48px;
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
    &:not(.hero__front_page):after {
      max-width: 1216px;
    }
  }

  &.hero__front_page {
    &.hero__white {
      ${theme.breakpoints.up("md")} {
        padding-top: 40px;
        margin-top: 0;
      }
    }
    ${theme.breakpoints.up("lg")} {
      margin-left: -32px;
      margin-right: -32px;
      max-width: none;
    }
  }
`,
)

const HeroContainer = styled("div")(
  ({ theme }) => `
  position: relative;
  
  ${theme.breakpoints.up("md")} {
    display: grid;
    position: relative;
  }

  .hero__small & {
    ${theme.breakpoints.up("md")} {
      grid-template-columns: 60% 1fr;
    }
  }
  .hero__large & {
    ${theme.breakpoints.up("md")} {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .hero__front_page & {
    position: relative;

    ${theme.breakpoints.up("md")} {
      display: flex;
      position: relative;
    }
  }
`,
)

const HeroImageContainer = styled("div")(
  ({ theme }) => `
  ${theme.breakpoints.up("md")} {
    order: 2;
    padding: 8px 0;
  }
  .hero__front_page.hero__large & {
    ${theme.breakpoints.up("md")} {
      width: 50%;
    }
  }
  .hero_front_page.hero__small & {
    ${theme.breakpoints.up("md")} {
      width: 40%;
    }
  }
  .hero__front_page & {
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
      padding: 0;
      background-color: ${theme.palette.common.grayscale.white};
      bottom: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
`,
)

const HeroImage = styled(Image)`
  .hero__front_page & {
    display: block;
    height: 100%;
    min-height: 205px;
    object-fit: cover;
    width: 100%;
  }
`

const HeroContentContainer = styled("div")(
  ({ theme }) => `
  padding: 24px 1rem 40px;
  margin: 0 auto;
  width: 100%;
  
  ${theme.breakpoints.up("xs")} {
    padding: 40px 2rem;
  }
  ${theme.breakpoints.up("lg")} {
    align-items: center;
    display: flex;
    padding: 40px 24px;
  }
  ${theme.breakpoints.up("xl")} {
    max-width: 1216px;
  }

  .hero__black & {
    background-color: ${theme.palette.common.grayscale.black};
  }
  .hero__blue & {
    background-color: ${theme.palette.common.brand.main};
  }
  .hero__white & {
    background-color: ${theme.palette.common.grayscale.white};
    ${theme.breakpoints.up("lg")} {
      padding: 40px 24px 40px 0;
    }
  }

  .hero__front_page & {
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
  }
`,
)

const HeroContent = styled("div")(
  ({ theme }) => `
  position: relative;

  .hero__front_page & {
    position: relative;

    ${theme.breakpoints.up("md")} {
      padding-right: 24px;
    }
  }
  .hero__small & {
    ${theme.breakpoints.up("md")} {
      max-width: 60%;
    }
  }
  .hero__large & {
    ${theme.breakpoints.up("md")} {
      max-width: 50%;
    }
  }
`,
)

const HeroSpacer = styled("div")(
  ({ theme }) => `
  display: none;

  ${theme.breakpoints.up("md")} {
    display: block;
    order: 1;
    position: absolute;
    inset: 0;
  }

  .hero__small & {
    ${theme.breakpoints.up("md")} {
      width: 60%;
    }
  }
  .hero__large & {
    ${theme.breakpoints.up("md")} {
      width: 50%;
    }
  }
  .hero__black & {
    background-color: ${theme.palette.common.grayscale.black};
  }
  .hero__blue & {
    background-color: ${theme.palette.common.brand.main};
  }
  .hero__white & {
    background-color: ${theme.palette.common.grayscale.white};
  }
`,
)

const HeroTitle = styled(Typography)(
  ({ theme }) => `
  hyphens: auto;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  max-width: 100%;
  width: auto;

  h2, &.MuiTypography-h2 {
    ${fontSize(36, 33)}
    font-weight: 700;
    letter-spacing: -0.8px;
    margin-bottom: 0;
    text-transform: none;
    ${theme.breakpoints.up("desktop")} {
      ${fontSize(36, 40)}
      letter-spacing: -1.15px;
    }
    ${theme.breakpoints.up("xl")} {
      ${fontSize(38, 48)}
      letter-spacing: -1.3px;
    }

    .hero__blue & {
      color: ${theme.palette.common.grayscale.white};
    }
    .hero__black & {
      color: ${theme.palette.common.grayscale.white};
    }
    .hero__white & {
      color: ${theme.palette.common.grayscale.black};
    }

    .hero__front_page & {
      ${fontSize(32, 38)}
      font-weight: 700;
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
    }
  }
`,
)

const HeroDescription = styled("p")(
  ({ theme }) => `
  ${fontSize(16, 24)}
  margin: 16px 0 0 0;
  padding: 0;
  position: relative;
  .hero__blue & {
    color: ${theme.palette.common.grayscale.white};
  }
  .hero__black & {
    color: ${theme.palette.common.grayscale.white};
  }
  .hero__white & {
    color: ${theme.palette.common.grayscale.black};
  }

  ${theme.breakpoints.up("xl")} {
    ${fontSize(17, 26)}
  }
`,
)

const HeroActions = styled("div")`
  margin-top: 24px;
`

interface HeroProps {
  title: string
  description?: string
  size?: HeroSize
  type?: HeroType
  color?: HeroColor
  imageProps?: ImageProps
  linkProps?: CTAButtonProps
}

function Hero({
  title,
  description,
  imageProps,
  size = "large",
  type = "landing",
  color = "white",
  linkProps,
}: HeroProps) {
  return (
    <HeroRoot className={`hero__${size} hero__${type} hero__${color}`}>
      <HeroContainer>
        <HeroImageContainer>
          {imageProps?.src && <HeroImage {...imageProps} />}
        </HeroImageContainer>
        <HeroSpacer />
        <HeroContentContainer>
          <HeroContent>
            <HeroTitle variant="h2">{title}</HeroTitle>
            {description && <HeroDescription>{description}</HeroDescription>}
            {linkProps?.href && (
              <HeroActions>
                <CTAButton {...linkProps} />
              </HeroActions>
            )}
          </HeroContent>
        </HeroContentContainer>
      </HeroContainer>
    </HeroRoot>
  )
}

export default Hero
