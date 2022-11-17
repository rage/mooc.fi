import React from "react"

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

const Layout: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <Header />
        <main id="main">
          <Breadcrumbs />
          <Alerts />
          {children}
        </main>
        <BottomNavigation />
        <Footer />
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
