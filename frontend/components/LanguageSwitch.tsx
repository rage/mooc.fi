import React from "react"
import Language from "@material-ui/icons/Language"
import NextI18Next from "../i18n"
import styled from "styled-components"
import { useRouter } from "next/router"
import Button from "@material-ui/core/Button"

const SwitchButton = styled(Button)`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
`

const LanguageSwitch = () => {
  const router = useRouter()
  let path = router.asPath
  if (path.startsWith("/en")) {
    path = path.slice(3)
  } else {
    path = `/en${path}`
  }

  return (
    <SwitchButton
      onClick={() => {
        NextI18Next.i18n.changeLanguage(
          NextI18Next.i18n.language === "en" ? "fi" : "en",
        )
        router.push(path)
      }}
    >
      <Language style={{ marginRight: "0.4rem" }} />
      {NextI18Next.i18n.language === "en" ? "SUOMI" : "ENGLISH"}
    </SwitchButton>
  )
}

export default LanguageSwitch
