import { useMemo } from "react"

import { useRouter } from "next/router"

import {
  AppBar,
  EnhancedLink,
  Link,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import HyLogoIcon from "../Icons/HyLogo"
import { NavigationMenu } from "../Navigation"
import LanguageSwitch from "./LanguageSwitch"
import MoocLogo from "./MoocLogo"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"

interface HideOnScrollProps {
  window?: () => Window
  children: React.ReactElement
}

function HideOnScroll({ window, children }: HideOnScrollProps) {
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const HyToolbar = styled(Toolbar)(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.black};
  border-bottom: 2px solid rgb(0, 0, 0, 0.7);
  position: relative;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  display: flex;
`,
)

const GroupToolbar = styled(Toolbar)(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  padding: 0 8px;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: auto 0;
  flex-flow: row;
  ${theme.breakpoints.up("lg")} {
    min-height: 82px;
    height: 82px;
  }
`,
)

const HyLogo = styled(HyLogoIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  height: 32px !important;
  width: 33.41px;
  transition: none !important;
`,
)

const HyLabel = styled("span")(
  ({ theme }) => `
  ${fontSize(12, 14)}
  font-weight: 700;
  color: ${theme.palette.common.grayscale.white};
  letter-spacing: -0.7px;
  margin-left: 8px;
  max-width: 160px;
  text-transform: uppercase;
  ${theme.breakpoints.up("xs")} {
    ${fontSize(12, 14)}
    letter-spacing: -0.6px;
    margin-left: 3px;
  }
  ${theme.breakpoints.up("md")} {
    ${fontSize(14, 14)}
  }
  ${theme.breakpoints.up("lg")} {
    letter-spacing: -0.6px;
    margin-left: 4px;
  }
  ${theme.breakpoints.up("xl")} {
    ${fontSize(14, 14)}
    margin-left: 8px;
  }
`,
)

const HyLogoLink = styled(Link)`
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  transition: none !important;
` as EnhancedLink

const BrandingContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  align-items: center;
  padding: 0px 0;
  ${theme.breakpoints.up("xl")} {
    padding: 12px 0;
  }
`,
)

const HeaderAppBar = styled(AppBar)`` as typeof AppBar

function Header() {
  const t = useTranslator(CommonTranslations)
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
    <HideOnScroll>
      <HeaderAppBar
        position="sticky"
        role="banner"
        aria-label="toolbar"
        elevation={0}
      >
        <HyToolbar>
          <HyLogoLink href={hyUrl}>
            <HyLogo />
            <HyLabel>{t("hy")}</HyLabel>
          </HyLogoLink>
          <LanguageSwitch />
        </HyToolbar>
        <GroupToolbar>
          <BrandingContainer>
            <MoocLogo />
          </BrandingContainer>
          <NavigationMenu />
        </GroupToolbar>
      </HeaderAppBar>
    </HideOnScroll>
  )
}

export default Header
