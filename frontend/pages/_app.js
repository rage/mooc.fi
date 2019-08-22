import React from "react"
import App, { Container } from "next/app"
import Router from "next/router"
import { initGA, logPageView } from "../lib/gtag"
import Head from "next/head"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { StylesProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ApolloProvider } from "@apollo/react-common"
import Layout from "./_layout"
import { isSignedIn, isAdmin } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import UserDetailContext from "../contexes/UserDetailContext"
import LanguageContext from "../contexes/LanguageContext"
import withApolloClient from "../lib/with-apollo-client"
import theme from "../src/theme"
import OpenSansCondensed from "typeface-open-sans-condensed"
import Roboto from "typeface-roboto"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"

fontAwesomeConfig.autoAddCss = false

class MyApp extends App {
  constructor(props) {
    super(props)
    this.toggleLogin = () => {
      this.setState({ loggedIn: !this.state.loggedIn })
    }
    this.state = {
      loggedIn: this.props.signedIn,
      logInOrOut: this.toggleLogin,
    }
  }
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
    const { Component, pageProps, apollo, admin, lng, url } = this.props

    return (
      <Container>
        <Head>
          <title>MOOC.fi</title>
        </Head>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <LoginStateContext.Provider value={this.state}>
                <UserDetailContext.Provider value={admin}>
                  <LanguageContext.Provider value={{ language: lng, url }}>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </LanguageContext.Provider>
                </UserDetailContext.Provider>
              </LoginStateContext.Provider>
            </ApolloProvider>
          </MuiThemeProvider>
        </StylesProvider>
      </Container>
    )
  }
}

// We're probably not supposed to do this
const originalGetInitialProps = MyApp.getInitialProps

function createPath(originalUrl) {
  let url = ""
  if (originalUrl === "/") {
    url = "/en"
  } else if (originalUrl === "/en") {
    url = "/"
  } else {
    originalUrl.startsWith("/en")
      ? (url = originalUrl.replace("/en/", "/fi/"))
      : (url = originalUrl.replace("/fi/", "/en/"))
  }

  return url
}

MyApp.getInitialProps = async arg => {
  const { ctx } = arg
  let lng = "fi"
  let url = "/"
  if (typeof window !== "undefined") {
    lng = ctx.asPath.substring(1, 3) || "fi"
    url = ctx.asPath
  } else {
    lng = ctx.query.lng || "fi"
    url = ctx.req.originalUrl
  }

  let originalProps = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(arg)) || {}
  }

  return {
    ...originalProps,
    signedIn: isSignedIn(ctx),
    admin: isAdmin(ctx),
    // @ts-ignore
    lng,
    url: createPath(url),
  }
}

export default withApolloClient(MyApp)
