import { useRouter } from "next/router"

import Language from "@mui/icons-material/Language"
import { styled } from "@mui/material/styles"

import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useTranslator } from "/hooks/useTranslator"
import PagesTranslations from "/translations/pages"

const SwitchButton = styled(HeaderMenuButton)`
  font-size: 14px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: black;
  justify-content: center;
  align-items: baseline;
  &:visited {
    color: black;
  }
  &:focus {
    color: black;
  }
  @media (max-width: 400px) {
    font-size: 12px;
  }
` as typeof HeaderMenuButton

const LanguageIcon = styled(Language)`
  margin-right: 0.4rem;
`

const LanguageName = styled("p")`
  margin: auto;
  @media (max-width: 350px) {
    display: none;
  }
`

const LanguageSwitch = () => {
  const t = useTranslator(PagesTranslations)
  const { locale, asPath } = useRouter()
  const newLocale = locale === "en" ? "fi" : "en"

  let href = asPath?.replace(/#.*/, "")
  if (t("alternate")?.[href]) {
    href = t("alternate")?.[href]
  }

  const language = locale === "en" ? "Suomi" : "English"

  return (
    <SwitchButton
      title={language}
      variant="text"
      color="inherit"
      href={href}
      locale={newLocale}
    >
      <LanguageIcon />
      <LanguageName data-testid="language-switch">
        {locale === "en" ? "Suomi" : "English"}
      </LanguageName>
    </SwitchButton>
  )
}

export default LanguageSwitch
