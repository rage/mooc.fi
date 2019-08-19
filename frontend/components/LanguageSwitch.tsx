import React from "react"
import Language from "@material-ui/icons/Language"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import Button from "@material-ui/core/Button"

const SwitchLink = styled(Button)`
  font-size: 14px;
  line-height: 1.3;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  color: black;
`

const LanguageSwitch = () => {
  return (
    <LanguageContext.Consumer>
      {({ language, toggleLanguage }) => (
        <SwitchLink onClick={toggleLanguage} variant="text">
          <Language style={{ marginRight: "0.4rem" }} />
          {language === "en" ? "Suomi" : "English"}
        </SwitchLink>
      )}
    </LanguageContext.Consumer>
  )
}

export default LanguageSwitch
