import { PropsWithChildren } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import { Breadcrumbs } from "/components/Breadcrumbs"
import Footer from "/components/Footer"
import Alerts from "/components/HeaderBar/Alerts"
import Header from "/components/HeaderBar/Header"
import SkipLink from "/components/SkipLink"
import Snackbars from "/components/Snackbars"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { fontVariableClass } from "/src/fonts"
import { fontVariableClass as newThemeFontVariableClass } from "/src/newTheme/typography"

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

const MobileBottomNavigation = dynamic(
  () => import("../components/MobileBottomNavigation"),
  {
    loading: () => null,
  },
)

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter()
  const { loggedIn, admin } = useLoginStateContext()

  const isHomePage = !!router?.asPath?.replace(/#(.*)/, "").match(/^\/?$/)
  const isNew = router.pathname?.includes("_new")
  const fontClass = isNew ? newThemeFontVariableClass : fontVariableClass

  return (
    <div className={fontClass}>
      <SkipLink />
      <FooterDownPusherWrapper>
        <div>
          <Header />
          <main id="main">
            {!isHomePage && <Breadcrumbs />}
            <Alerts />
            {children}
          </main>
          <Snackbars />
        </div>
        <Footer />
        <FooterUpPusher />
        {loggedIn && admin ? <MobileBottomNavigation /> : null}
      </FooterDownPusherWrapper>
    </div>
  )
}

export default Layout
