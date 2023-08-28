import React, { useState } from "react"

import { useRouter } from "next/router"

import {
  Button,
  EnhancedButton,
  EnhancedLink,
  EnhancedMenuItem,
  Link,
  Menu,
  MenuItem,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import CaretDownIcon from "../Icons/CaretDown"
import CaretUpIcon from "../Icons/CaretUp"
import GlobeIcon from "../Icons/Globe"
import { useTranslator } from "/hooks/useTranslator"
import { KeyOfTranslationDictionary } from "/translations"
import CommonTranslations from "/translations/common"

const LanguageSwitchMenu = styled(Menu)(
  ({ theme }) => `
  justify-items: center;
  text-transform: uppercase;
  top: 11px;

  .MuiPaper-root {
    width: max-content;
    padding: 10px;
    border-radius: 0 0 5px 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 10px;
    min-width: 160px;
    right: -15px;

    ${theme.breakpoints.up("xl")} {
      left: -15px;
    }
  }

  .MuiList-root {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

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

/*
 */
const LanguageOption = styled(MenuItem)(
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
      color: ${theme.palette.common.grayscale.medium};
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
`

const LanguageButton = styled(Button)(
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
  font-weight: 600;
  font-size: 1rem;

  svg:first-of-type {
    display: none !important;
  }

  ${theme.breakpoints.up("lg")} {
    font-size: 0.75rem;
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
`,
) as EnhancedButton

const CaretUp = styled(CaretUpIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  font-size: 8px;
`,
)
const CaretDown = styled(CaretDownIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  font-size: 8px;
`,
)
const LanguageIcon = styled(GlobeIcon)(
  ({ theme }) => `
  fill: ${theme.palette.common.grayscale.white};
  font-size: 14px;
`,
)

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
      <LanguageButton
        color="secondary"
        id={name}
        aria-controls={open ? menuName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleLanguageSwitchClick}
      >
        <LanguageIcon />
        {currentLocale}
        {open ? <CaretUp /> : <CaretDown />}
      </LanguageButton>
      <LanguageSwitchMenu
        id={menuName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        MenuListProps={{
          "aria-labelledby": name,
        }}
      >
        {locales?.map((locale) => (
          <LanguageOption
            key={`${name}${locale}`}
            selected={locale === currentLocale}
            onClick={handleClose}
          >
            <LanguageOptionLink href={asPath} locale={locale} shallow>
              {t(
                locale as KeyOfTranslationDictionary<typeof CommonTranslations>,
              )}{" "}
              ({locale})
            </LanguageOptionLink>
          </LanguageOption>
        ))}
      </LanguageSwitchMenu>
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
