import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import getUserOS from "/util/getUserOS"
import OSSelector from "/components/Installation/OSSelector"
import MDX_Linux from "/static/md_pages/netbeans_installation_fi.mdx"
import MDX_Windows from "/static/md_pages/netbeans_installation_windows_fi.mdx"
import MDX_MAC from "/static/md_pages/netbeans_installation_mac_fi.mdx"
import UserOSContext from "/contexes/UserOSContext"
import { userOsType } from "/util/getUserOS"
import NoOsMessage from "/components/Installation/NoOsMessage"
import LanguageContext from "/contexes/LanguageContext"
import getInstallationTranslator from "/translations/installation"

const Background = styled.section`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

const Title = styled(Typography)`
  margin-bottom: 0.4em;
  padding: 1rem;
`
const TitleBackground = styled.div`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

const Content = styled.div`
  position: relative;
`
export const SectionBox = styled.div`
  margin-bottom: 6rem;
`
export const ContentBox = styled.div`
  background-color: white;
  max-width: 39em;
  border: 3px solid black;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 2em;
  margin-top: 1em;
  font-size: 18px;
  line-height: 37px;
  h2 {
    font-size: 37px;
    line-height: 64px;
    font-family: Open Sans Condensed, sans serif !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: Open Sans Condensed, sans serif !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: Open Sans Condensed, sans serif !important;
  }
  code {
    background-color: #ff26b8;
    padding: 0.5rem;
  }
`

const NetBeans = () => {
  const [userOS, setUserOs] = React.useState<userOsType>(getUserOS())
  const { language } = React.useContext(LanguageContext)
  const t = getInstallationTranslator(language)

  const changeOS = (OS: userOsType) => {
    setUserOs(OS)
  }
  const mapOsToInstructions: Record<userOsType, JSX.Element> = {
    Linux: <MDX_Linux />,
    Windows: <MDX_Windows />,
    MAC: <MDX_MAC />,
    OS: <NoOsMessage />,
  }

  return (
    <UserOSContext.Provider value={{ OS: userOS, changeOS: changeOS }}>
      <Background>
        <TitleBackground>
          <Title component="h1" variant="h1" align="center">
            {t("title")}
          </Title>
        </TitleBackground>
        <TitleBackground style={{ width: "45%", marginBottom: "8em" }}>
          <Title component="p" variant="subtitle1" align="center">
            {t("subtitle")}
          </Title>
        </TitleBackground>
        <Content>
          <OSSelector />
          {mapOsToInstructions[userOS]}
        </Content>
      </Background>
    </UserOSContext.Provider>
  )
}

NetBeans.getInitialProps = () => {
  return {}
}

export default NetBeans
