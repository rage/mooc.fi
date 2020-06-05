import React, { useContext } from "react"
import Language from "@material-ui/icons/Language"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
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
  const { language, url, hrefUrl } = useContext(LanguageContext)

  return (
    <Link as={url} href={url === "/" ? "/" : hrefUrl}>
      <SwitchLink href={hrefUrl}>
        <Language style={{ marginRight: "0.4rem" }} />
        <p style={{ margin: "auto" }} data-testid="language-switch">
          {language === "en" ? "Suomi" : "English"}
        </p>
      </SwitchLink>
    </Link>
  )
}

export default LanguageSwitch
