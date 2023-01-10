import React from "react"

import Link from "next/link"
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

const LanguageSwitchContainer = styled(
  (props: ButtonGroupProps & ButtonProps) => (
    <ButtonGroup
      component={(buttonProps) => (
        <Button component="div" {...buttonProps} tabIndex={-1} />
      )}
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
  padding: 0.5rem;
  max-height: 10vh;
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
        <Link href={asPath} locale={locale} passHref key={`switch-${locale}`}>
          <Language
            active={currentLocale === locale}
            aria-label={t(locale as keyof (typeof CommonTranslations)[string])}
          >
            {locale}
          </Language>
        </Link>
      ))}
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
