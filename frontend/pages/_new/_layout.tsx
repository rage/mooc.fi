import React from "react"

import backgroundPattern from "static/images/backgroundPattern2.svg"

import { styled } from "@mui/material/styles"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/NewLayout/Header/Header"
import { BottomNavigation } from "/components/NewLayout/Navigation/BottomNavigation"
import SkipLink from "/components/SkipLink"

const FooterDownPusherWrapper = styled("div")`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Background = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -10;
  background: #fefefe;
  background-image: url(${backgroundPattern});
`

const MainContent = styled("main")`
  position: relative;
`

const Layout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <Header />
        <MainContent id="main">
          <Background />
          <Breadcrumbs />
          <Alerts />
          {children}
        </MainContent>
        <Footer />
        <BottomNavigation />
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
