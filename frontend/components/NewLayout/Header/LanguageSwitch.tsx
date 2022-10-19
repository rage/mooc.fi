import Link from "next/link"
import { useRouter } from "next/router"

import LanguageIcon from "@mui/icons-material/Language"
import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"

const LanguageSwitchContainer = styled((props: any) => (
  <Button component="div" disableRipple={true} {...props} />
))`
  gap: 0.5rem;
`

const Language = styled("a")<{ active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "300")};
`

const locales = ["en", "fi"]

const LanguageSwitch = () => {
  const { locale: currentLocale, asPath } = useRouter()

  return (
    <LanguageSwitchContainer>
      <LanguageIcon />
      {locales.map((locale) => (
        <Link href={asPath} locale={locale} passHref key={`switch-${locale}`}>
          <Language active={currentLocale === locale}>{locale}</Language>
        </Link>
      ))}
    </LanguageSwitchContainer>
  )
}

export default LanguageSwitch
