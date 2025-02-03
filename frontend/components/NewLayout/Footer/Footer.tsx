import { useMemo } from "react"

import { useRouter } from "next/router"

import FacebookIcon from "@fortawesome/fontawesome-free/svgs/brands/facebook.svg?icon"
import TwitterIcon from "@fortawesome/fontawesome-free/svgs/brands/twitter.svg?icon"
import YoutubeIcon from "@fortawesome/fontawesome-free/svgs/brands/youtube.svg?icon"
import { Link as MUILink, type EnhancedLink } from "@mui/material"
import { styled } from "@mui/material/styles"

import ArrowRightIcon from "../Icons/ArrowRight"
import HyLogoIcon from "../Icons/HyLogo"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"
import HomeTranslations from "/translations/home"

const FooterContainer = styled("footer")(
  ({ theme }) => `
  display: block;
  background-color: ${theme.palette.common.grayscale.black};
  max-width: 100%;
  margin-top: 5rem;
`,
)

const FooterBase = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.black};
  display: flex;
  flex-direction: column-reverse;
  max-height: 100%;
  padding: 32px 16px;
  place-content: center space-between;
  position: relative;
  width: 100%;

  ${theme.breakpoints.up("xs")} {
    flex-direction: column-reverse;
    margin: 0 auto;
    max-width: 1920px;
    padding: 32px 24px 32px 24px;
  }

  ${theme.breakpoints.up("md")} {
    flex-direction: row;
    padding: 36px 32px;
  }

  ${theme.breakpoints.up("lg")} {
    padding: 40px 32px;
  }
`,
)

const FooterBaseLeft = styled("div")(
  ({ theme }) => `
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 24px;

  ${theme.breakpoints.up("xs")} {
    align-items: center;
    width: 100%;
  }

  ${theme.breakpoints.up("md")} {
    align-items: flex-start;
    width: 31.11%;
  }
`,
)

const FooterBaseLogo = styled("div")(
  ({ theme }) => `
  span {
    ${fontSize(18, 16)}
    font-weight: 700;
    letter-spacing: -0.9px;
    color: ${theme.palette.common.grayscale.white};
    text-transform: uppercase;

    min-width: max-content;
    max-width: max-content;
  }
`,
)

const FooterBaseContent = styled("div")(
  ({ theme }) => `
  ${fontSize(16, 24)}
  color: ${theme.palette.common.grayscale.white};
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.1px;
  margin: 32px 0;
  white-space: pre-line;

  ${theme.breakpoints.up("xs")} {
    margin: 32px 0;
  }

  ${theme.breakpoints.up("md")} {
    margin: 42px 0;
  }

  ${theme.breakpoints.up("lg")} {
    margin: 54px 0;
  }

  address {
    font-style: normal;
  }

  a {
    color: ${theme.palette.common.grayscale.white};
  }
`,
)

const FooterBaseSocial = styled("div")(
  ({ theme }) => `
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 64px;
  z-index: 2;

  ${theme.breakpoints.up("md")} {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 0;
  }

  ${theme.breakpoints.up("lg")} {
    align-items: center;
    flex-direction: row;
  }
`,
)

const FooterBaseSocialItems = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const FooterBaseRight = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  max-height: 100%;
  width: 100%;

  ${theme.breakpoints.up("xs")} {
    margin-bottom: 32px;
    max-height: 300px;
    width: calc(100% + 24px);
  }

  ${theme.breakpoints.up("md")} {
    max-height: 350px;
    width: 65.56%;
  }
`,
)

const FooterBaseCopy = styled("span")(
  ({ theme }) => `
  ${fontSize(16, 24)}
  bottom: 40px;
  color: ${theme.palette.common.grayscale.white};
  display: inline-block;
  font-weight: 600;
  letter-spacing: -0.1px;
  position: absolute;
  right: 50%;
  text-align: center;
  transform: translateX(50%);
  width: 100%;

  a {
    color: ${theme.palette.common.grayscale.white};

    &::hover {
      color: ${theme.palette.common.grayscale.medium};
      text-decoration: underline;
    }
  }
  ${theme.breakpoints.up("xs")} {
    bottom: 32px;
    right: 50%;
    transform: translateX(50%);
  }

  ${theme.breakpoints.up("md")} {
    bottom: 36px;
    right: 32px;
    text-align: right;
    transform: none;
  }

  ${theme.breakpoints.up("lg")} {
    bottom: 40px;
  }
`,
)

const Link = MUILink as EnhancedLink

const SocialLink = styled(Link)(
  ({ theme }) => `
  margin-right: 24px;

  color: ${theme.palette.common.grayscale.white};
  svg {
    width: 36px !important;
    height: 36px !important;
    fill: ${theme.palette.common.grayscale.white};
  }
  :last-child() {
    margin-right: 0;
  }

  &:hover {
    color: ${theme.palette.common.grayscale.medium} !important;
    svg {
      fill: ${theme.palette.common.grayscale.medium} !important;
    }
  }
`,
)

const HyLogo = styled(HyLogoIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  height: 32px !important;
  width: 33.41px;
  transition: none !important;

  ${theme.breakpoints.up("xs")} {
    height: 48px !important;
    width: 51px;
  }
`,
)

const HyLogoLabel = styled("span")(
  ({ theme }) => `
  ${fontSize(18, 16)}
  font-weight: 700;
  letter-spacing: -0.7px;
  color: ${theme.palette.common.grayscale.white};
  text-transform: uppercase;
  margin-left: 8px;
  max-width: 90px;

  ${theme.breakpoints.up("xs")} {
    ${fontSize(15, 16)}
    letter-spacing: -0.75px;
    margin-left: 6px;

  }
  ${theme.breakpoints.up("lg")} {
    ${fontSize(14, 14)}
    letter-spacing: -0.6px;
    margin-left: 4px;
  }
`,
)

const HyLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: none !important;
` as EnhancedLink

const FooterLink = styled(Link)(
  ({ theme }) => `
  ${fontSize(14, 18)}
  font-weight: 600;
  height: fit-content;
  border-bottom: 1px solid ${theme.palette.common.grayscale.white};
  color: ${theme.palette.common.grayscale.white};
  letter-spacing: -0.5px;
  padding: 15px 20px 15px 0;
  display: flex;
  margin-left: 0;
  margin-right: 0;
  position: relative;
  text-decoration: none;
  width: 100%;

  svg {
    fill: ${theme.palette.common.grayscale.white};
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  ${theme.breakpoints.up("xs")} {
    width: 50%;
    margin-left: 0;
    margin-right: 24px;
  }

  ${theme.breakpoints.up("md")} {
    margin-left: 32px;
    margin-right: 0;
  }

  ${theme.breakpoints.up("lg")} {
    margin-left: 48px;
  }
`,
)

const Footer = () => {
  const t = useTranslator(CommonTranslations, HomeTranslations)
  const { locale } = useRouter()

  const hyUrl = useMemo(() => {
    let url = "https://helsinki.fi/"
    if (locale !== "sv") {
      url += locale
    } else {
      url += "sv"
    }
    return url
  }, [locale])

  return (
    <FooterContainer>
      <FooterBase>
        <FooterBaseLeft>
          <FooterBaseLogo>
            <HyLogoLink href={hyUrl} target="_blank">
              <HyLogo />
              <HyLogoLabel>{t("hy")}</HyLogoLabel>
            </HyLogoLink>
          </FooterBaseLogo>
          <FooterBaseContent>
            <address>mooc@cs.helsinki.fi</address>
          </FooterBaseContent>
          <FooterBaseSocial>
            <FooterBaseSocialItems>
              <SocialLink
                aria-label="MOOC.fi Facebook"
                href="https://www.facebook.com/Moocfi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </SocialLink>
              <SocialLink
                aria-label="MOOC.fi Youtube channel"
                href="https://www.youtube.com/channel/UCkHoQ5p9skFdyjrV3_tnUrA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YoutubeIcon />
              </SocialLink>
            </FooterBaseSocialItems>
          </FooterBaseSocial>
        </FooterBaseLeft>
        <FooterBaseRight>
          <FooterLink href={t("privacyPolicyLink")}>
            {t("privacyPolicy")}
            <ArrowRightIcon sx={{ fontSize: 16 }} />
          </FooterLink>
          <FooterBaseCopy>
            This site is maintained by the University of Helsinki's MOOC center
          </FooterBaseCopy>
        </FooterBaseRight>
      </FooterBase>
    </FooterContainer>
  )
}

export default Footer
