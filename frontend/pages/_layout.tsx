import { ReactNode } from "react"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/HeaderBar/Header"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import SkipLink from "/components/SkipLink"
import { useRouter } from "next/router"

import styled from "@emotion/styled"

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const path = router?.asPath?.replace(/#(.*)/, "")?.replace(/^\/new/, "")

  const isHomePage = !!path?.match(/^\/(fi|en|se|\[lng\])?\/?$/)

  // {!isHomePage && <DashboardBreadCrumbs />}
  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <div>
          <Header />
          <main id="main">
            <div>New layout</div>
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
