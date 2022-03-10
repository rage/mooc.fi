import { useContext } from "react"
import Language from "@mui/icons-material/Language"
import styled from "@emotion/styled"
import LanguageContext from "/contexts/LanguageContext"
import Link from "next/link"
// import LangLink from "/components/LangLink"

const SwitchLink = styled.a`
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

const LanguageSwitch = () => {
  const { language, url } = useContext(LanguageContext)

  return (
    <Link href={url} passHref>
      <SwitchLink>
        <Language style={{ marginRight: "0.4rem" }} />
        <p style={{ margin: "auto" }} data-testid="language-switch">
          {language === "en" ? "Suomi" : "English"}
        </p>
      </SwitchLink>
    </Link>
  )
}

export default LanguageSwitch
