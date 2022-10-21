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

const LanguageSwitchContainer = styled(
  (props: ButtonGroupProps & ButtonProps) => (
    <ButtonGroup
      component={(buttonProps) => <Button component="div" {...buttonProps} />}
      disableRipple
      disableFocusRipple
      disableTouchRipple
      {...props}
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
  const { locale: currentLocale, locales, asPath } = useRouter()

  return (
    <LanguageSwitchContainer>
      <LanguageIcon />
      {locales?.map((locale) => (
        <Link href={asPath} locale={locale} passHref key={`switch-${locale}`}>
          <Language active={currentLocale === locale}>{locale}</Language>
        </Link>
      ))}
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
