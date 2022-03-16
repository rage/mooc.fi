// superseded by _app.tsx, left here for reference

import "@fortawesome/fontawesome-svg-core/styles.css"

import React from "react"

import AlertContext from "/contexts/AlertContext"
import { BreadcrumbContext } from "/contexts/BreadcrumbContext"
import LanguageContext from "/contexts/LanguageContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { initGA, logPageView } from "/lib/gtag"
import withApolloClient from "/lib/with-apollo-client"
import { fontCss } from "/src/fonts"
import theme from "/src/theme"
import getTranslator from "/translations"
import PageTranslations from "/translations/pages"
import { ConfirmProvider } from "material-ui-confirm"
import App from "next/app"
import Head from "next/head"
import Router from "next/router"

import { ApolloProvider } from "@apollo/client"
import { CacheProvider, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@mui/material"

import createEmotionCache from "../src/createEmotionCache"
import Layout from "./_layout"

fontAwesomeConfig.autoAddCss = false

const clientSideEmotionCache = createEmotionCache()
const getPageTranslator = getTranslator(PageTranslations)
class MyApp extends App {
  constructor(props) {
    super(props)
    this.toggleLogin = () => {
      this.setState({
        loggedIn: !this.state.loggedIn,
      })
    }
    this.updateCurrentUser = (user) => {
      this.setState({
        currentUser: user,
      })
    }
    this.state = {
      loggedIn: this.props.signedIn,
      logInOrOut: this.toggleLogin,
      alerts: [],
      breadcrumbs: [],
      admin: this.props.admin,
      currentUser: this.props.currentUser,
      updateUser: this.updateCurrentUser,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props?.currentUser !== state.currentUser) {
      return {
        ...state,
        currentUser: props.currentUser,
        admin: props.admin,
      }
    }

    return state
  }

  componentDidMount() {
    initGA()
    logPageView()
    Router.router.events.on("routeChangeComplete", logPageView)

    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }

    const path = window.location.hash
    if (path?.includes("#")) {
      // try scrolling to hash with increasing timeouts; if successful, clear remaining timeouts
      const timeouts = [100, 500, 1000, 2000].map((ms) =>
        setTimeout(() => {
          const id = path.replace("#", "")

          if (id) {
            try {
              document?.querySelector("#" + id).scrollIntoView()
              timeouts.forEach((t) => clearTimeout(t))
            } catch {}
          }
        }, ms),
      )
    }
  }

  addAlert = (alert) =>
    this.setState((state, _) => {
      const newAlerts = state.alerts.concat(alert)
      return { alerts: newAlerts }
    })

  removeAlert = (alert) =>
    this.setState({ alerts: this.state.alerts.filter((a) => a !== alert) })

  setBreadcrumbs = (breadcrumbs) => this.setState({ breadcrumbs })

  render() {
    const {
      Component,
      pageProps,
      apollo,
      admin,
      lng,
      languageSwitchUrl,
      asUrl,
      hrefUrl,
      currentUser,
      emotionCache = clientSideEmotionCache,
    } = this.props

    // give router to translator to get query parameters
    const t = getPageTranslator(lng, Router.router)
    const titleString =
      t("title", { title: "..." })?.[hrefUrl] ||
      t("title", { title: "..." })?.[asUrl]

    const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

    return (
      <>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
            <title>{title}</title>
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <LoginStateContext.Provider value={this.state}>
                <LanguageContext.Provider
                  value={{ language: lng, url: languageSwitchUrl, hrefUrl }}
                >
                  <ConfirmProvider>
                    <BreadcrumbContext.Provider
                      value={{
                        breadcrumbs: this.state.breadcrumbs,
                        setBreadcrumbs: this.setBreadcrumbs,
                      }}
                    >
                      <AlertContext.Provider
                        value={{
                          alerts: this.state.alerts,
                          addAlert: this.addAlert,
                          removeAlert: this.removeAlert,
                        }}
                      >
                        <Layout>
                          <Global styles={fontCss} />
                          <Component {...pageProps} />
                        </Layout>
                      </AlertContext.Provider>
                    </BreadcrumbContext.Provider>
                  </ConfirmProvider>
                </LanguageContext.Provider>
              </LoginStateContext.Provider>
            </ApolloProvider>
          </ThemeProvider>
        </CacheProvider>
      </>
    )
  }
}

// We're probably not supposed to do this
const originalGetInitialProps = MyApp.getInitialProps

const languages = ["en", "fi", "se"]

function createPath(originalUrl) {
  let url = ""
  /*   if (originalUrl === "/") {
    url = "/en/"
  } else  */
  if (originalUrl?.match(/^\/en\/?$/)) {
    url = "/"
  } else if (originalUrl?.startsWith("/en")) {
    url = originalUrl.replace("/en/", "/fi/")
  } else if (originalUrl?.startsWith("/se")) {
    url = originalUrl.replace("/se/", "/fi/")
  } else if (originalUrl?.startsWith("/fi")) {
    url = originalUrl.replace("/fi/", "/en/")
  } else {
    url = "/en" + originalUrl
  }
  /*       ? (url = originalUrl.replace("/en/", "/fi/"))
      : (url = originalUrl.replace("/fi/", "/en/"))
    originalUrl.startsWith("/se") && (url = originalUrl.replace("/se/", "/fi/"))
  }
 */
  return url
}

MyApp.getInitialProps = async (props) => {
  const { ctx } = props
  let lng = "fi"
  let asUrl = "/"
  let hrefUrl = "/"

  if (typeof window !== "undefined") {
    if (languages.includes(ctx?.asPath?.substring(1, 3) ?? "")) {
      lng = ctx.asPath.substring(1, 3)
    }

    asUrl = ctx.asPath
    hrefUrl = ctx.pathname
  } else {
    const maybeLng = ctx.query.lng ?? "fi"

    if (languages.includes(maybeLng)) {
      lng = maybeLng
    } else {
      ctx?.res.writeHead(302, { location: "/404" })
      ctx?.res.end()
    }

    asUrl = ctx.req.originalUrl
    hrefUrl = ctx.pathname //.req.path
  }

  let originalProps = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) || {}
  }

  return {
    ...originalProps,
    signedIn: isSignedIn(ctx),
    admin: isAdmin(ctx),
    lng,
    asUrl,
    languageSwitchUrl: createPath(asUrl),
    hrefUrl,
  }
}

export default withApolloClient(MyApp)
