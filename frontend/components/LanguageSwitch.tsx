import React from "react"
import Language from "@material-ui/icons/Language"
import NextI18Next from "../i18n"
import styled from "styled-components"
import { useRouter } from "next/router"
import Button from "@material-ui/core/Button"
import Link from "next/link"

const SwitchLink = styled.a`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
  display: flex;
  flex-direction: row;
`

const LanguageSwitch = () => {
  let path: string = ""

  const router = useRouter()

  if (router) {
    path = router.asPath

    if (path.startsWith("/en")) {
      path = path.slice(3)
    } else {
      path = `/en${path}`
    }
  }

  /*NextI18Next.i18n
            .changeLanguage(NextI18Next.i18n.language === "en" ? "fi" : "en")*/

  return (
    <Link href={path}>
      <SwitchLink href={path}>
        <Language style={{ marginRight: "0.4rem" }} />
        <p style={{ marginTop: "0.2rem" }}>
          {NextI18Next.i18n.language === "en" ? "Suomi" : "English"}
        </p>
      </SwitchLink>
    </Link>
  )
}

export default LanguageSwitch
