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

import createCache from "@emotion/cache"
import { CacheProvider, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"

import { DOMAIN } from "../config"
import { validateToken } from "../packages/moocfi-auth"
// import { StyledEngineProvider } from "@material-ui/styled-engine"
// import { ApolloProvider } from "@apollo/client"
import Layout from "./_layout"

fontAwesomeConfig.autoAddCss = false

export const cache = createCache({ key: "css", prepend: true })

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
      loggedIn: this.props.pageProps?.signedIn,
      logInOrOut: this.toggleLogin,
      alerts: [],
      breadcrumbs: [],
      admin: this.props.pageProps?.admin,
      validated: this.props.pageProps?.validated,
      currentUser: this.props.pageProps?.currentUser,
      updateUser: this.updateCurrentUser,
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props?.pageProps?.currentUser !== state.currentUser) {
      return {
        ...state,
        currentUser: props.pageProps?.currentUser,
        admin: props.pageProps?.admin,
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

    // redirect to create a TMC account if user doesn't have one
    // TODO: replace this with a nagging modal that will go away only when you have a TMC account
    /*if (this.props.pageProps?.currentUser) {
      if (this.props.pageProps?.currentUser.upstream_id < 0 && !Router.router.pathname?.startsWith("/[lng]/sign-up/edit-details")) {
        Router.replace(`/${this.props.pageProps?.lng}/sign-up/edit-details`)
      }
    }*/
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
    const { Component, pageProps } = this.props

    const {
      admin,
      lng = "fi",
      languageSwitchUrl = "/en/",
      asUrl = "/",
      hrefUrl,
      currentUser,
    } = pageProps

    // give router to translator to get query parameters
    const t = getPageTranslator(lng, Router.router)
    const titleString =
      t("title", { title: "..." })?.[hrefUrl] ||
      t("title", { title: "..." })?.[asUrl]

    const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

    return (
      <>
        <CacheProvider value={cache}>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
            <title>{title}</title>
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
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
    url = originalUrl.replace(/^\/en/, "/fi")
  } else if (originalUrl?.startsWith("/se")) {
    url = originalUrl.replace(/^\/se/, "/fi")
  } else if (originalUrl?.startsWith("/fi")) {
    url = originalUrl.replace(/^\/fi/, "/en")
  } else {
    url = "/en" + (originalUrl ?? "/")
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
  let validated = true

  if (ctx.req?.url?.indexOf("/_next/data/") === -1) {
    // server
    validated = validateToken("tmc", DOMAIN, ctx)
    // validated = await validateToken("tmc", DOMAIN, ctx)
  }

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
      ctx.res.writeHead(302, { location: "/404" })
      ctx.res.end()
    }

    asUrl = ctx.req.originalUrl
    hrefUrl = ctx.pathname //.req.path
  }

  let originalProps = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) || {}
  }

  console.log("originalProps", originalProps)
  /*if (hrefUrl !== "/" && !hrefUrl.startsWith("/[lng]")) {
    hrefUrl = `/[lng]${hrefUrl}`
  }*/

  console.log(validated)
  const signedIn = await isSignedIn(ctx)
  const admin = await isAdmin(ctx)

  return {
    ...originalProps,
    pageProps: {
      ...originalProps.pageProps,
      validated,
      signedIn,
      admin,
      lng,
      asUrl,
      languageSwitchUrl: createPath(asUrl),
      hrefUrl,
    },
  }
}

export default withApolloClient(MyApp)
