import React from "react"
import App, { Container } from "next/app"
import Router from "next/router"
import { initGA, logPageView } from "../lib/gtag"
import * as gtag from "../lib/gtag"
import Head from "next/head"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { StylesProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ApolloProvider } from "react-apollo"
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks"
import Layout from "./_layout"
import { isSignedIn, isAdmin } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import UserDetailContext from "../contexes/UserDetailContext"
import LanguageContext from "../contexes/LanguageContext"
import withApolloClient from "../lib/with-apollo-client"
import NextI18Next from "../i18n"
import theme from "../src/theme"
import OpenSansCondensed from "typeface-open-sans-condensed"
import Roboto from "typeface-roboto"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
fontAwesomeConfig.autoAddCss = false

class MyApp extends App {
  componentDidMount() {
    initGA()
    logPageView()
    Router.router.events.on("routeChangeComplete", logPageView)

    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const {
      Component,
      pageProps,
      apollo,
      signedIn,
      admin,
      language,
      url,
    } = this.props

    console.log("language", language)
    return (
      <Container>
        <Head>
          <title>MOOC.fi</title>
        </Head>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />

            <ApolloProvider client={apollo}>
              <ApolloHooksProvider client={apollo}>
                <LoginStateContext.Provider value={signedIn}>
                  <UserDetailContext.Provider value={admin}>
                    <LanguageContext.Provider value={{ language, url }}>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </LanguageContext.Provider>
                  </UserDetailContext.Provider>
                </LoginStateContext.Provider>
              </ApolloHooksProvider>
            </ApolloProvider>
          </MuiThemeProvider>
        </StylesProvider>
      </Container>
    )
  }
}

// We're probably not supposed to do this
const originalGetInitialProps = MyApp.getInitialProps

//add language subpath to url
function createPath(originalUrl) {
  if (originalUrl.startsWith("/en")) {
    return originalUrl.slice(3)
  } else {
    return `/en${originalUrl}`
  }
}

MyApp.getInitialProps = async arg => {
  const { ctx } = arg

  let originalProps = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(arg)) || {}
  }

  return {
    ...originalProps,
    signedIn: isSignedIn(ctx),
    admin: isAdmin(ctx),
    // @ts-ignore
    language: ctx && ctx.req ? ctx.req.language : "",
    url: ctx && ctx.req ? createPath(ctx.req.originalUrl) : "",
  }
}

const withTranslation = NextI18Next.appWithTranslation(MyApp)

export default withApolloClient(withTranslation)
