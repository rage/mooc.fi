import React from "react"
//import Language from "@material-ui/icons/Language"
//import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"

/*const SwitchLink = styled.a`
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
`*/

const LanguageSwitch = () => {
  //const language = React.useContext(LanguageContext)
  //console.log("Language Context", language)
  return (
    <LanguageContext.Consumer>
      {({ language, toggleLanguage }) => (
        <button onClick={toggleLanguage}>
          {language}:{language === "en" ? "Suomi" : "English"}
        </button>
      )}
    </LanguageContext.Consumer>
  )
}

export default LanguageSwitch

//<Language style={{ marginRight: "0.4rem" }} />
