import React from "react"
import Language from "@material-ui/icons/Language"
import { Button } from "@material-ui/core"
import NextI18Next from "../i18n"
import styled from "styled-components"

const SwitchButton = styled(Button)`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
`

const LanguageSwitch = () => {
  return (
    <SwitchButton
      variant="text"
      color="default"
      onClick={() =>
        NextI18Next.i18n.changeLanguage(
          NextI18Next.i18n.language === "en" ? "fi" : "en",
        )
      }
    >
      <Language style={{ marginRight: "0.4rem" }} />
      {NextI18Next.i18n.language === "en"
        ? "Suomenkielinen versio"
        : "English Version"}
    </SwitchButton>
  )
}

export default LanguageSwitch
