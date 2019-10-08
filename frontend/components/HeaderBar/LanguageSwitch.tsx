import React from "react"
import Language from "@material-ui/icons/Language"
import styled from "styled-components"
import LanguageContext from "/contexes/LanguageContext"
import LangLink from "components/LangLink"

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
  return (
    <LanguageContext.Consumer>
      {({ language, url, hrefUrl }) => {
        return (
          <LangLink as={url} href={hrefUrl}>
            <SwitchLink href={url}>
              <Language style={{ marginRight: "0.4rem" }} />
              <p style={{ margin: "auto" }} data-testid="language-switch">
                {language === "en" ? "Suomi" : "English"}
              </p>
            </SwitchLink>
          </LangLink>
        )
      }}
    </LanguageContext.Consumer>
  )
}

export default LanguageSwitch
