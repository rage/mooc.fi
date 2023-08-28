import React from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/NewLayout/Header"
import PageLoadingIndicators from "/components/PageLoadingIndicators"
import SkipLink from "/components/SkipLink"

const FooterDownPusherWrapper = styled("div")`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const MainContent = styled("main")`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
`

const Layout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  const isHomePage = !!RegExp(/^\/_new\/?$/).exec(
    router?.asPath?.replace(/#(.*)/, ""),
  )

  return (
    <>
      <PageLoadingIndicators />
      <SkipLink />
      <FooterDownPusherWrapper>
        <Header />
        <MainContent id="main">
          {!isHomePage && <Breadcrumbs />}
          <Alerts />
          {children}
        </MainContent>
        <Footer />
      </FooterDownPusherWrapper>
    </>
  )
}

export default Layout
