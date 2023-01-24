import { useCallback, useEffect, useMemo, useState } from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import NoOsMessage from "/components/Installation/NoOsMessage"
import OSSelector from "/components/Installation/OSSelector"
import Spinner from "/components/Spinner"
import UserOSContext from "/contexts/UserOSContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import MDX_Linux_en from "/public/md_pages/netbeans_installation_Linux_en.mdx"
import MDX_Linux from "/public/md_pages/netbeans_installation_Linux_fi.mdx"
import MDX_MAC_en from "/public/md_pages/netbeans_installation_macOS_en.mdx"
import MDX_MAC from "/public/md_pages/netbeans_installation_macOS_fi.mdx"
import MDX_Windows_en from "/public/md_pages/netbeans_installation_Windows_en.mdx"
import MDX_Windows from "/public/md_pages/netbeans_installation_Windows_fi.mdx"
import MDX_Any_en from "/public/md_pages/netbeans_installation_ZIP_en.mdx"
import MDX_Any from "/public/md_pages/netbeans_installation_ZIP_fi.mdx"
import InstallationTranslations from "/translations/installation"
import getUserOS, { UserOSType } from "/util/getUserOS"
import { useTranslator } from "/util/useTranslator"

const Background = styled("section")`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

const Title = styled(Typography)`
  margin-bottom: 0.4em;
  padding: 1rem;
` as typeof Typography

const TitleBackground = styled("div")`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

const Content = styled("div")`
  position: relative;
`
export const SectionBox = styled("div")`
  margin-bottom: 6rem;
`
export const ContentBox = styled("div")`
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
    font-family: var(--header-font) !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: var(--header-font) !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: var(--header-font) !important;
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
  const [userOS, setUserOS] = useState<UserOSType>(getUserOS())
  const [render, setRender] = useState(false)
  const t = useTranslator(InstallationTranslations)
  const { locale } = useRouter()

  useBreadcrumbs([
    {
      translation: "installation",
    },
    {
      label: "Netbeans",
      href: `/installation/netbeans`,
    },
  ])

  const changeOS = useCallback((OS: UserOSType) => {
    setUserOS(OS)
  }, [])

  useEffect(() => {
    setRender(true)
  }, [])

  const Instructions = useCallback(() => {
    const elementMap: Record<UserOSType, Record<string, JSX.Element>> = {
      Linux: { en: <MDX_Linux_en />, fi: <MDX_Linux /> },
      Windows: { en: <MDX_Windows_en />, fi: <MDX_Windows /> },
      macOS: { en: <MDX_MAC_en />, fi: <MDX_MAC /> },
      OS: { en: <NoOsMessage />, fi: <NoOsMessage /> },
      ZIP: { en: <MDX_Any_en />, fi: <MDX_Any /> },
    }
    return elementMap[userOS][locale ?? "fi"]
  }, [userOS, locale])

  const contextValue = useMemo(() => ({ OS: userOS, changeOS }), [userOS])

  return (
    <UserOSContext.Provider value={contextValue}>
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
              <Instructions />
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
