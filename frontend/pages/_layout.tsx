import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/HeaderBar/Header"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import SkipLink from "/components/SkipLink"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { ReactNode } from "react"

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
