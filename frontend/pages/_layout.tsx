import * as React from "react"
import Header from "../components/HeaderBar/Header"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import Footer from "/components/Footer"
import SkipLink from "/components/SkipLink"
import styled from "styled-components"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"

const FooterDownPusherWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SkipLink />
      <FooterDownPusherWrapper>
        <div>
          <Header />
          {/*add top margin to main to push the content from under the header*/}

          <main id="main" style={{ marginTop: 75 }}>
            <DashboardBreadCrumbs />
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
