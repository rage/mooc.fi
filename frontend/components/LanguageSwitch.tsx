import React from "react"
import Language from "@material-ui/icons/Language"
import { Button } from "@material-ui/core"
import Router from "next/router"
import NextI18Next from "../i18n"
import styled from "styled-components"

const SwitchButton = styled(Button)`
  font-size: 12px;
  line-height: 1.3;
  padding-right: 1px;

  @media (min-width: 400px) {
    font-size: 14px;
  }
`

function LanguageSwitch() {
  return (
    <SwitchButton
      onClick={() =>
        NextI18Next.i18n.changeLanguage(
          NextI18Next.i18n.language === "en" ? "fi" : "en",
        )
      }
    >
      {NextI18Next.i18n.language === "en"
        ? "Suomenkielinen versio"
        : "English version"}
      <Language style={{ marginLeft: "0.5rem" }} />
    </SwitchButton>
  )
}

export default LanguageSwitch
