import React from "react"

import { useRouter } from "next/router"

import { styled } from "@mui/material/styles"

import Alerts from "/components/HeaderBar/Alerts"
import Footer from "/components/NewLayout/Footer"
import Header from "/components/NewLayout/Header"
import Breadcrumbs from "/components/NewLayout/Navigation/Breadcrumbs"
import PageLoadingIndicators from "/components/PageLoadingIndicators"
import SkipLink from "/components/SkipLink"

const FooterDownPusherWrapper = styled("div")`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
`

const MainContainer = styled("main")`
  display: flex;
  margin: 0 auto;
  max-width: 1920px;
  padding: 0;
  width: 100%;
  position: relative;
`

const LayoutContent = styled("div")(
  ({ theme }) => `
  padding: 0;
  width: 100%;

  ${theme.breakpoints.up("sm")} {
    margin: 0 auto;
    width: 100%;
  }
  ${theme.breakpoints.up("lg")} {
    flex-grow: 1;
    order: 2;
    width: 80%;
  }
  ${theme.breakpoints.up("xl")} {
    padding: 0 2rem;
  }
`,
)
const Layout: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  const isHomePage = !!RegExp(/^\/_new\/?$/).exec(
    router?.asPath?.replace(/#(.*)/, ""),
  )

  return (
    <>
      <PageLoadingIndicators />
      <SkipLink />
      <FooterDownPusherWrapper>
        <Header />
        <MainContainer id="main">
          <LayoutContent>
            {!isHomePage && <Breadcrumbs />}
            <Alerts />
            {children}
          </LayoutContent>
        </MainContainer>
        <Footer />
      </FooterDownPusherWrapper>
    </>
  )
}

export default Layout
