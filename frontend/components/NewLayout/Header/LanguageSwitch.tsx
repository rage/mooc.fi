import React, { useState } from "react"

import { useRouter } from "next/router"

import {
  ButtonBase,
  EnhancedButtonBase,
  EnhancedLink,
  EnhancedMenuItem,
  Link,
  ListItem,
  Popover,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import CaretDownIcon from "../Icons/CaretDown"
import CaretUpIcon from "../Icons/CaretUp"
import GlobeIcon from "../Icons/Globe"
import { useTranslator } from "/hooks/useTranslator"
import { KeyOfTranslationDictionary } from "/translations"
import CommonTranslations from "/translations/common"

const LanguageSwitchMenu = styled(Popover)(
  ({ theme }) => `
  justify-items: center;
  text-transform: uppercase;
  top: 34px;
  right: -15px;
  ${theme.breakpoints.up("xl")} {
    left: -15px;
    right: 0;
  }

  .MuiPopover-paper {
    position: absolute;
    width: max-content;
    padding: 10px;
    border-radius: 0 0 5px 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 10px;
    min-width: 160px;
  }

`,
)

const LanguageSwitchMenuList = styled("ul")(
  ({ theme }) => `
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;

  .Mui-selected {
    color: ${theme.palette.common.grayscale.black};
    background-color: transparent;
    border: 2px solid ${theme.palette.common.grayscale.black};

    &:hover {
      color: ${theme.palette.common.grayscale.black};
      background-color: ${theme.palette.common.grayscale.backgroundBox};
    }
  }

`,
)
const LanguageOption = styled(ListItem)(
  ({ theme }) => `
  margin: 0;
  padding: 0;
  color: ${theme.palette.common.brand.light};
   
  &:hover {
    color: ${theme.palette.common.brand.main};
    background-color: ${theme.palette.common.grayscale.backgroundBox};
  }

  &.Mui-selected {
    color: ${theme.palette.common.grayscale.black};
    background-color: transparent;
    border: 2px solid ${theme.palette.common.grayscale.black};

    &:hover {
      background-color: ${theme.palette.common.grayscale.backgroundBox};
    }
  }
`,
) as EnhancedMenuItem

const LanguageOptionLink = styled(Link)`
  font-size: 1rem;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0;
  padding: 12px;
  display: block;
  color: inherit;
  text-decoration: none;
` as EnhancedLink

const LanguageSwitchContainer = styled("div")`
  align-items: center;
  display: flex;
  height: 100%;
  position: relative;
`

const LanguageSwitchToggle = styled(ButtonBase)(
  ({ theme }) => `
  color: ${theme.palette.common.grayscale.white};
  align-items: center;
  background-color: transparent;
  border: 0;
  display: inline-grid;
  gap: 4px;
  grid-template-columns: repeat(2, auto);
  letter-spacing: -0.7px;
  margin: 0;
  padding: 14px 10px;
  text-transform: uppercase;
  height: 100%;
  position: relative;
  font-weight: 700;
  font-size: 1rem;
  line-height: 16px;

  svg {
    fill: ${theme.palette.common.grayscale.white};
  }
  svg:first-of-type {
    display: none !important;
  }

  &:focus {
    outline: solid 2px ${theme.palette.common.additional.yellow.main};
    outline-offset: 2px;
  }
  ${theme.breakpoints.up("lg")} {
    font-size: 0.75rem;
    line-height: 24px;
    font-weight: 400;
    letter-spacing: -0.5px;
    grid-template-columns: repeat(3, auto);
    padding: 0;

    svg:first-of-type {
      display: inline-block !important;
    }
  }

  &::after {
    border-bottom: 0;
  }
  &:hover {
    color: ${theme.palette.common.grayscale.medium};
    svg {
      fill: ${theme.palette.common.grayscale.medium};
    }
    cursor: pointer;
    border: 0;
  }

  &[aria-expanded="true"] {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      height: 4px;
      right: 0;
      bottom: -1px;
      left: 0;
      background-color: ${theme.palette.common.grayscale.black};
    }
  }
`,
) as EnhancedButtonBase

type LanguageSwitchProps = {
  mobile?: boolean
}

const LanguageSwitch = ({ mobile }: LanguageSwitchProps) => {
  const t = useTranslator(CommonTranslations)
  const { locale: currentLocale, locales, asPath } = useRouter()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleLanguageSwitchClick = useEventCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setAnchorEl(event.currentTarget)
    },
  )
  const handleClose = useEventCallback(() => {
    setAnchorEl(null)
  })

  const menuName = mobile
    ? "mobile-language-switch-menu"
    : "language-switch-menu"
  const name = mobile ? "mobile-language-switch" : "language-switch"

  return (
    <LanguageSwitchContainer>
      <LanguageSwitchToggle
        id={name}
        aria-label={t("openLanguageMenu")}
        aria-controls={open ? menuName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleLanguageSwitchClick}
      >
        <GlobeIcon sx={{ fontSize: "14px" }} />
        {currentLocale}
        {open ? (
          <CaretUpIcon sx={{ fontSize: "8px" }} />
        ) : (
          <CaretDownIcon sx={{ fontSize: "8px" }} />
        )}
      </LanguageSwitchToggle>
      <LanguageSwitchMenu
        id={menuName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
      >
        <LanguageSwitchMenuList aria-labelledby={name}>
          {locales?.map((locale) => (
            <LanguageOption
              key={`${name}${locale}`}
              selected={locale === currentLocale}
              onClick={handleClose}
            >
              <LanguageOptionLink href={asPath} locale={locale} shallow>
                {t(
                  locale as KeyOfTranslationDictionary<
                    typeof CommonTranslations
                  >,
                )}{" "}
                ({locale})
              </LanguageOptionLink>
            </LanguageOption>
          ))}
        </LanguageSwitchMenuList>
      </LanguageSwitchMenu>
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
