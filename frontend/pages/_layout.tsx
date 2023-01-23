import { PropsWithChildren } from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/HeaderBar/Header"
import MobileBottomNavigation from "/components/MobileBottomNavigation"
import SkipLink from "/components/SkipLink"
import { fontVariableClass } from "/src/fonts"

const FooterDownPusherWrapper = styled("div")`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

// when the footer is visible, it will overlap the content;
// this empty div appears with the dynamic height of the toolbar to offset this
const FooterUpPusher = styled("div")(
  ({ theme }) => `
  display: flex;
  min-height: ${theme.mixins.toolbar.minHeight}px;

  @media (min-width: 1050px) {
    display: none;
  }
`,
)

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter()

  const isHomePage = !!router?.asPath?.replace(/#(.*)/, "").match(/^\/?$/)

  return (
    <div className={fontVariableClass}>
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
        <Footer />
        <FooterUpPusher />
        <MobileBottomNavigation />
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
