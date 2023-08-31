import Image, { ImageProps } from "next/image"

import { EnhancedLink, EnhancedLinkProps, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import ArrowRightIcon from "../Icons/ArrowRight"
import ContentWrapper from "./ContentWrapper"
import { fontSize } from "/src/theme/util"

const IntroductionContainer = styled("div")(
  ({ theme }) => `
  padding-top: 1.75rem;
  margin-bottom: 1.75rem;
  ${theme.breakpoints.up("md")} {
    padding-top: 2rem;
    margin-bottom: 2rem;
  }
  ${theme.breakpoints.up("lg")} {
    padding-top: 2.25rem;
    margin-bottom: 2.25rem;
  }
`,
)

const IntroductionContent = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.has-image {
    ${theme.breakpoints.up("md")} {
      margin: 0;
      padding: 0;
      width: 50%;
    }
  }
  &:not(.has-image) {
    width: 100%;
    ${theme.breakpoints.up("md")} {
      width: 91.46%;
    }
    ${theme.breakpoints.up("lg")} {
      width: 82.89%;
    }
    ${theme.breakpoints.up("xl")} {
      width: 74.2%
    }
  }
`,
)

const OuterContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: column-reverse;
  flex: 1 1 auto;
  justify-content: space-between;

  ${theme.breakpoints.up("md")} {
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 0;

    gap: 32px;
  }

  ${theme.breakpoints.up("xl")} {
    gap: 48px;
  }
`,
)

const IntroductionLink = styled(Link)(
  ({ theme }) => `
  ${fontSize(16, 20)}
  letter-spacing: -0.5px;
  background-color: ${theme.palette.common.brand.light};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: ${theme.palette.common.grayscale.white};
  cursor: pointer;
  display: inline-block;
  font-weight: 700;
  height: 100%;
  padding: 12px 60px 12px 12px;
  position: relative;
  text-decoration: none;

  ${theme.breakpoints.up("xs")} {
    ${fontSize(16, 20)}
    letter-spacing: -0.6px;
    padding: 15px 62px 15px 16px;
  }

  ${theme.breakpoints.up("md")} {
    ${fontSize(18, 20)}
  }

  ${theme.breakpoints.up("lg")} {
    ${fontSize(20, 20)}
    letter-spacing: -0.7px;
    padding: 16px 70px 16px 18px;
  }

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    fill: ${theme.palette.common.grayscale.white};
  }
`,
) as EnhancedLink

const IntroductionImageContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  justify-content: stretch;
  margin-bottom: 0;
  min-height: 10rem;
  position: relative;
  width: 100%;
  height: 100% !important;

  ${theme.breakpoints.up("md")} {
    width: 50%;
  }
`,
)

const IntroductionImage = styled(Image)`
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100% !important;
`

const IntroductionTitleContainer = styled("div")(
  ({ theme }) => `
  ${theme.breakpoints.up("md")} {
    padding-top: 0;
  }
`,
)

const IntroductionTitle = styled("h2")(
  ({ theme }) => `
  ${fontSize(28, 32)}
  font-weight: 700;
  letter-spacing: -0.7px;
  text-transform: uppercase;
  ${theme.breakpoints.up("md")} {
    ${fontSize(34, 40)}
    letter-spacing: -0.85px;
  }
  ${theme.breakpoints.up("lg")} {
    ${fontSize(42, 48)}
    letter-spacing: -1.05px;
    padding: 0 0 1rem;
  }
  ${theme.breakpoints.up("xl")} {
    padding: 0 0 20px;
  }
`,
)
const IntroductionDescription = styled("p")(
  ({ theme }) => `
  ${fontSize(15, 22)}
  font-weight: 200;
  color: ${theme.palette.common.grayscale.black};
  margin-bottom: 24px;
  margin-top: 0;

  ${theme.breakpoints.up("xs")} {
    ${fontSize(16, 24)}
  }
  ${theme.breakpoints.up("md")} {
    margin-bottom: 28px;
  }
  ${theme.breakpoints.up("xl")} {
    ${fontSize(17, 26)}
  }
`,
)

interface IntroductionProps {
  title: string
  description?: string
  href?: EnhancedLinkProps["href"]
  target?: EnhancedLinkProps["target"]
  linkTitle?: string
  linkLabel?: string
  imageProps?: ImageProps
}

const Introduction = ({
  title,
  description,
  href,
  target,
  linkTitle,
  linkLabel,
  imageProps,
}: IntroductionProps) => {
  return (
    <IntroductionContainer>
      <ContentWrapper>
        <OuterContainer>
          <IntroductionContent
            className={imageProps?.src ? "has-image" : undefined}
          >
            <IntroductionTitleContainer>
              <IntroductionTitle dangerouslySetInnerHTML={{ __html: title }} />
            </IntroductionTitleContainer>
            <IntroductionDescription>{description}</IntroductionDescription>
            {href && (
              <div>
                <IntroductionLink
                  href={href}
                  target={target}
                  aria-label={linkLabel}
                >
                  {linkTitle}
                  <ArrowRightIcon sx={{ fontSize: 24 }} />
                </IntroductionLink>
              </div>
            )}
          </IntroductionContent>
          {imageProps?.src && (
            <IntroductionImageContainer>
              <IntroductionImage {...imageProps} />
            </IntroductionImageContainer>
          )}
        </OuterContainer>
      </ContentWrapper>
    </IntroductionContainer>
  )
}

export default Introduction
