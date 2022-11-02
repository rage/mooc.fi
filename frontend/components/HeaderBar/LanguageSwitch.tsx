import Link from "next/link"
import { useRouter } from "next/router"

import styled from "@emotion/styled"
import Language from "@mui/icons-material/Language"

const SwitchLink = styled(Link)`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: black;
  &:visited {
    color: black;
  }
  &:focus {
    color: black;
  }
  @media (max-width: 400px) {
    font-size: 10px;
  }
`

const LanguageIcon = styled(Language)`
  margin-right: 0.4rem;
`

const LanguageName = styled.p`
  margin: auto;
`

const LanguageSwitch = () => {
  const { locale, asPath } = useRouter()
  const newLocale = locale === "en" ? "fi" : "en"

  const href = asPath?.replace(/#.*/, "")

  return (
    <SwitchLink href={href} locale={newLocale}>
      <LanguageIcon />
      <LanguageName data-testid="language-switch">
        {locale === "en" ? "Suomi" : "English"}
      </LanguageName>
    </SwitchLink>
  )
}

export default LanguageSwitch
