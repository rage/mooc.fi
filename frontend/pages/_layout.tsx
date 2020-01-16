import * as React from "react"
import Header from "../components/HeaderBar/Header"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import Footer from "/components/Footer"
import SkipLink from "/components/SkipLink"
import styled from "styled-components"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"
import LanguageContext from "/contexes/LanguageContext"

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Layout = ({ children }: { children: React.ReactNode }) => {
  const lng = React.useContext(LanguageContext)
  const isHomePage = !!lng.hrefUrl?.match(/^\/(\[lng\])?\/?$/)

  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <div>
          <Header />

          <main id="main">
            {!isHomePage && <DashboardBreadCrumbs />}

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
