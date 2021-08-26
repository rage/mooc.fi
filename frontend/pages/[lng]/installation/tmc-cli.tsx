import { useState, useContext, useEffect } from "react"
import styled from "@emotion/styled"
import Typography from "@material-ui/core/Typography"
import getUserOS from "/util/getUserOS"
import OSSelector from "/components/Installation/OSSelector"
import MDX_Linux from "/static/md_pages/tmc-cli_installation_Linux_en.mdx"
import MDX_Linux_en from "/static/md_pages/tmc-cli_installation_Linux_en.mdx"
import MDX_Windows from "/static/md_pages/tmc-cli_installation_Windows_en.mdx"
import MDX_Windows_en from "/static/md_pages/tmc-cli_installation_Windows_en.mdx"
import MDX_MAC from "/static/md_pages/tmc-cli_installation_macOS_en.mdx"
import MDX_MAC_en from "/static/md_pages/tmc-cli_installation_macOS_en.mdx"
import MDX_Any from "/static/md_pages/tmc-cli_installation_Linux_en.mdx"
import MDX_Any_en from "/static/md_pages/tmc-cli_installation_Linux_en.mdx"
import UserOSContext from "/contexts/UserOSContext"
import { userOsType } from "/util/getUserOS"
import NoOsMessage from "/components/Installation/NoOsMessage"
import LanguageContext from "/contexts/LanguageContext"
import InstallationTranslations from "/translations/installation"
import Spinner from "/components/Spinner"
import { useTranslator } from "/util/useTranslator"

const Background = styled.section`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

const Title = styled(Typography)<any>`
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
  padding-top: 5em;
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
    background-color: #e6f4f1;
    padding: 0.5rem;
  }
  img {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #c3fcf2;
    padding: 1.5rem;
  }
`

const NetBeans = () => {
  const [userOS, setUserOs] = useState<userOsType>(getUserOS())
  const [render, setRender] = useState(false)
  const { language } = useContext(LanguageContext)
  const t = useTranslator(InstallationTranslations)

  const changeOS = (OS: userOsType) => {
    setUserOs(OS)
  }

  useEffect(() => {
    setRender(true)
  }, [])

  const mapOsToInstructions: Record<
    userOsType,
    { en: JSX.Element; fi: JSX.Element }
  > = {
    Linux: { en: <MDX_Linux_en />, fi: <MDX_Linux /> },
    Windows: { en: <MDX_Windows_en />, fi: <MDX_Windows /> },
    macOS: { en: <MDX_MAC_en />, fi: <MDX_MAC /> },
    OS: { en: <NoOsMessage />, fi: <NoOsMessage /> },
    ZIP: { en: <MDX_Any_en />, fi: <MDX_Any /> },
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
          {render ? (
            <>
              <OSSelector />
              {language == "fi"
                ? mapOsToInstructions[userOS].fi
                : mapOsToInstructions[userOS].en}
            </>
          ) : (
            <Spinner />
          )}
        </Content>
      </Background>
    </UserOSContext.Provider>
  )
}

export default NetBeans
