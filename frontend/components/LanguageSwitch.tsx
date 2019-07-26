import React from "react"
import Language from "@material-ui/icons/Language"
import NextI18Next from "../i18n"
import styled from "styled-components"
import { useRouter } from "next/router"
import LanguageContext from "../contexes/LanguageContext"

const SwitchLink = styled.a`
  font-size: 14px;
  line-height: 1.3;
  font-weight: bold;
  display: flex;
  flex-direction: row;
`
interface Props {
  path: string
}
function createPath(props: Props) {
  const { path } = props
  if (path.startsWith("/en")) {
    return path.slice(3)
  } else {
    return `/en${path}`
  }
}

const Link = () => {
  const router = useRouter()

  React.useEffect(() => {
    console.log("doing the effectnow")
    if (router) {
      console.log("doing the path thing now")
      let path1 = createPath({ path: router.asPath })
      console.log(path1)
    }
  }, [])
  return (
    <SwitchLink href={createPath({ path: router.asPath })}>
      <Language style={{ marginRight: "0.4rem" }} />
      <p style={{ marginTop: "0.2rem" }}>
        {NextI18Next.i18n.language === "en" ? "Suomi" : "English"}
      </p>
    </SwitchLink>
  )
}
const LanguageSwitch = () => {
  return (
    <LanguageContext.Consumer>
      {language => (
        <SwitchLink href={language.languageSwitchLink}>
          <Language style={{ marginRight: "0.4rem" }} />
          <p style={{ marginTop: "0.2rem" }}>
            {NextI18Next.i18n.language === "en" ? "Suomi" : "English"}
          </p>
        </SwitchLink>
      )}
    </LanguageContext.Consumer>
  )
}

export default LanguageSwitch
