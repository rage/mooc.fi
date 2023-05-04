import React from "react"

import { useRouter } from "next/router"

import LanguageIcon from "@mui/icons-material/Language"
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
  EnhancedButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const LanguageSwitchButton = (buttonProps: ButtonProps<"div">) => (
  <Button {...buttonProps} component="div" tabIndex={-1} />
)

const StyledButtonGroup = styled(ButtonGroup)`
  cursor: unset;
  max-height: 8vh;
` as typeof ButtonGroup

const LanguageSwitchContainer = (props: ButtonGroupProps & ButtonProps) => (
  <StyledButtonGroup
    component={LanguageSwitchButton}
    disableRipple
    disableFocusRipple
    disableTouchRipple
    {...props}
    tabIndex={-1}
  />
)

interface LanguageButtonProps {
  active: boolean
}
const Language = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<LanguageButtonProps>`
  border: 0;
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "300")};

  &:hover {
    border: 0;
  }
` as EnhancedButton<"button", LanguageButtonProps>

const LanguageSwitch = () => {
  const t = useTranslator(CommonTranslations)
  const { locale: currentLocale, locales, asPath } = useRouter()

  return (
    <LanguageSwitchContainer>
      <LanguageIcon />
      {locales?.map((locale) => (
        <Language
          key={locale}
          href={asPath}
          locale={locale}
          active={currentLocale === locale}
          title={t(locale as keyof (typeof CommonTranslations)[string])}
          aria-label={t(locale as keyof (typeof CommonTranslations)[string])}
        >
          {locale}
        </Language>
      ))}
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
