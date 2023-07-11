import React from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/NewLayout/Header"
import { BottomNavigation } from "/components/NewLayout/Navigation/BottomNavigation"
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
        <BottomNavigation />
      </FooterDownPusherWrapper>
    </>
  )
}

export default Layout
