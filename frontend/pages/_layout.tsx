import * as React from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import SkipLink from "../components/SkipLink"
import styled from "styled-components"

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
          <main id="main">{children}</main>
        </div>
        <Footer />
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
