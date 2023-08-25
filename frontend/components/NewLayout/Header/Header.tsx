import { AppBar, Slide, Toolbar, useScrollTrigger } from "@mui/material"
import { styled } from "@mui/material/styles"

import HyLogoIcon from "../Icons/HyLogo"
import { DesktopNavigationMenu, MobileNavigationMenu } from "../Navigation"
import LanguageSwitch from "./LanguageSwitch"
import MoocLogo from "./MoocLogo"
import { useTranslator } from "/hooks/useTranslator"
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
  padding: 0;
  margin: 0;
  position: relative;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
`,
)

const GroupToolbar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  padding: 0 8px;
`

const HyLogo = styled(HyLogoIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  font-size: 32;
  ${theme.breakpoints.up("lg")} {
    font-size: 64;
  }
`,
)

const HyLabel = styled("span")(
  ({ theme }) => `
  font-size: 0.75rem;
  line-height: 14px;
  font-weight: 700;
  color: ${theme.palette.common.grayscale.white};
  letter-spacing: -0.7px;
  margin-left: 8px;
  max-width: 90px;
  text-transform: uppercase;
  ${theme.breakpoints.down("xs")} {
    font-size: 0.75rem;
    line-height: 14px;
    letter-spacing: -0.6px;
    margin-left: 3px;
  }
  ${theme.breakpoints.up("md")} {
    font-size: 0.875rem;
  }
  ${theme.breakpoints.up("lg")} {
    letter-spacing: -0.6px;
    margin-left: 4px;
  }
  ${theme.breakpoints.up("xl")} {
    font-size: 0.875rem;
    margin-left: 8px;
  }
`,
)

const HyLogoContainer = styled("div")(
  ({ theme }) => `
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${theme.breakpoints.down("xs")} {
    min-width: min-content;
    max-width: max-content;
    white-space: nowrap;
  }
  ${theme.breakpoints.up("lg")} {
    min-width: min-content;
    max-width: 90px;
    white-space: initial;
  }
  ${theme.breakpoints.up("xl")} {
    min-width: min-content;
    max-width: max-content;
    white-space: nowrap;
  }
`,
)

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

const HeaderAppBar = styled(AppBar)`
  /**/
` as typeof AppBar

function Header() {
  const t = useTranslator(CommonTranslations)

  return (
    <HideOnScroll>
      <HeaderAppBar position="sticky" aria-label="toolbar" elevation={0}>
        <HyToolbar>
          <HyLogoContainer>
            <HyLogo />
            <HyLabel>{t("hy")}</HyLabel>
          </HyLogoContainer>
          <LanguageSwitch />
        </HyToolbar>
        <GroupToolbar>
          <BrandingContainer>
            <MoocLogo />
          </BrandingContainer>
          <DesktopNavigationMenu />
          <MobileNavigationMenu />
        </GroupToolbar>
      </HeaderAppBar>
    </HideOnScroll>
  )
}

export default Header
