import { useEffect, useState } from "react"

import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

import NoOsMessage from "/components/Installation/NoOsMessage"
import OSSelector from "/components/Installation/OSSelector"
import Spinner from "/components/Spinner"
import UserOSContext from "/contexts/UserOSContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import MDX_Linux_en from "/static/md_pages/vscode_installation_Linux_en.mdx"
import MDX_Linux from "/static/md_pages/vscode_installation_Linux_fi.mdx"
import MDX_MAC_en from "/static/md_pages/vscode_installation_macOS_en.mdx"
import MDX_MAC from "/static/md_pages/vscode_installation_macOS_fi.mdx"
import MDX_Windows_en from "/static/md_pages/vscode_installation_Windows_en.mdx"
import MDX_Windows from "/static/md_pages/vscode_installation_Windows_fi.mdx"
import InstallationTranslations from "/translations/installation"
import getUserOS, { userOsType } from "/util/getUserOS"
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
    padding: 0.5rem 0rem;
  }
  img {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #c3fcf2;
    padding: 1.5rem;
  }
`

const VSCode = () => {
  const [userOS, setUserOs] = useState<userOsType>(getUserOS())
  const [render, setRender] = useState(false)
  const t = useTranslator(InstallationTranslations)
  const { locale } = useRouter()

  useBreadcrumbs([
    {
      translation: "installation",
    },
    {
      label: "VSCode",
      href: `/installation/vscode`,
    },
  ])

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
    ZIP: { en: <NoOsMessage />, fi: <NoOsMessage /> },
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
              <OSSelector excludeZip={true} />
              {locale == "fi"
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

export default VSCode
