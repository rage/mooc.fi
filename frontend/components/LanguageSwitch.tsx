import React from "react"
import Language from "@material-ui/icons/Language"
import { Button } from "@material-ui/core"
import NextI18Next from "../i18n"
import styled from "styled-components"

const SwitchButton = styled(Button)`
  font-size: 12px;
  line-height: 1.3;
  padding-right: 1px;
  font-weight: bold;

  @media (min-width: 400px) {
    font-size: 14px;
  }
`

const LanguageSwitch = ({ t }) => {
  return (
    <SwitchButton
      onClick={() =>
        NextI18Next.i18n.changeLanguage(
          NextI18Next.i18n.language === "en" ? "fi" : "en",
        )
      }
    >
      <Language style={{ marginRight: "0.5rem" }} />
      {NextI18Next.i18n.language === "en"
        ? "SUOMENKIELINEN VERSIO"
        : "ENGLISH VERSION"}
    </SwitchButton>
  )
}

export default NextI18Next.withTranslation("common")(LanguageSwitch)
