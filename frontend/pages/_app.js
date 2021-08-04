import React from "react"
import App from "next/app"
import Router from "next/router"
import { initGA, logPageView } from "/lib/gtag"
import Head from "next/head"
import { ThemeProvider } from "@material-ui/core/styles"
// import { StyledEngineProvider } from "@material-ui/styled-engine"
import { ApolloProvider } from "@apollo/client"
import Layout from "./_layout"
import { isSignedIn, isAdmin } from "/lib/authentication"
import LoginStateContext from "/contexts/LoginStateContext"
import LanguageContext from "/contexts/LanguageContext"
import { BreadcrumbContext } from "/contexts/BreadcrumbContext"
import withApolloClient from "/lib/with-apollo-client"
import theme from "/src/theme"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { CssBaseline } from "@material-ui/core"
import PageTranslations from "/translations/pages"
import { ConfirmProvider } from "material-ui-confirm"
import AlertContext from "/contexts/AlertContext"
import getTranslator from "/translations"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { fontCss } from "/src/fonts"
import { Global } from "@emotion/react"

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
      url,
      hrefUrl,
      currentUser,
    } = this.props

    // give router to translator to get query parameters
    const t = getPageTranslator(lng, Router.router)
    const titleString =
      t("title", { title: "..." })?.[hrefUrl] ||
      t("title", { title: "..." })?.[url]

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
  let url = "/"
  let hrefUrl = "/"

  if (typeof window !== "undefined") {
    if (languages.includes(ctx?.asPath?.substring(1, 3) ?? "")) {
      lng = ctx.asPath.substring(1, 3)
    }

    url = ctx.asPath
    hrefUrl = ctx.pathname
  } else {
    const maybeLng = ctx.query.lng ?? "fi"

    if (languages.includes(maybeLng)) {
      lng = maybeLng
    } else {
      ctx.res.writeHead(302, { location: "/404" })
      ctx.res.end()
    }

    url = ctx.req.originalUrl
    hrefUrl = ctx.pathname //.req.path
  }

  let originalProps = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) || {}
  }

  if (hrefUrl !== "/" && !hrefUrl.startsWith("/[lng]")) {
    hrefUrl = `/[lng]${hrefUrl}`
  }

  return {
    ...originalProps,
    signedIn: isSignedIn(ctx),
    admin: isAdmin(ctx),
    lng,
    url,
    languageSwitchUrl: createPath(url),
    hrefUrl,
  }
}

export default withApolloClient(MyApp)
