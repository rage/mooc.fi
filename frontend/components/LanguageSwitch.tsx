import React from "react"
import Language from "@material-ui/icons/Language"

import styled from "styled-components"
import LanguageContext from "../contexes/LanguageContext"

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
`

const LanguageSwitch = () => {
  const language = React.useContext(LanguageContext)
  return (
    <SwitchLink href={language.url}>
      <Language style={{ marginRight: "0.4rem" }} />
      <p style={{ marginTop: "0.2rem" }}>
        {language.language === "en" ? "Suomi" : "English"}
      </p>
    </SwitchLink>
  )
}

export default LanguageSwitch
