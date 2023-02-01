import React from "react"

import { useRouter } from "next/router"

import LanguageIcon from "@mui/icons-material/Language"
import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  ButtonProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const LanguageSwitchButton = (buttonProps: ButtonProps) => (
  <Button component="div" {...buttonProps} tabIndex={-1} />
)

const LanguageSwitchContainer = styled(
  (props: ButtonGroupProps & ButtonProps) => (
    <ButtonGroup
      component={LanguageSwitchButton}
      disableRipple
      disableFocusRipple
      disableTouchRipple
      {...props}
      tabIndex="-1"
    />
  ),
  {
    name: "MuiButton",
    overridesResolver: (_, styles) => styles.root,
  },
)`
  cursor: unset;
  max-height: 8vh;
`

const Language = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<ButtonProps & { active: boolean }>`
  border: 0;
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "300")};

  &:hover {
    border: 0;
  }
`

const LanguageSwitch = () => {
  const t = useTranslator(CommonTranslations)
  const { locale: currentLocale, locales, asPath } = useRouter()

  return (
    <LanguageSwitchContainer>
      <LanguageIcon />
      {locales?.map((locale) => (
        <Language
          key={`switch-${locale}`}
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
