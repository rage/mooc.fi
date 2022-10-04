import { ReactNode } from "react"

import { useRouter } from "next/router"

import styled from "@emotion/styled"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import Header from "/components/NewLayout/Header/Header"
import SkipLink from "/components/SkipLink"

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const isHomePage = !!router?.asPath?.replace(/#(.*)/, "").match(/^\/?$/)

  // {!isHomePage && <DashboardBreadCrumbs />}
  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <div>
          <Header />
          <main id="main">
            {!isHomePage && <Breadcrumbs />}
            <Alerts />
            {children}
          </main>
        </div>
        <MobileBottomNavigation />
        <Footer />
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
