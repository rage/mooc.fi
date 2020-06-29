import React from "react"
import App from "next/app"
import Router from "next/router"
import { initGA, logPageView } from "../lib/gtag"
import Head from "next/head"
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/styles"
import { ApolloProvider } from "@apollo/react-hooks"
import Layout from "./_layout"
import { isSignedIn, isAdmin } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import LanguageContext from "../contexes/LanguageContext"
import withApolloClient from "../lib/with-apollo-client"
import theme from "../src/theme"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { CssBaseline } from "@material-ui/core"
import getPageTranslator from "/translations/pages"
import { ConfirmProvider } from "material-ui-confirm"
import AlertContext from "../contexes/AlertContext"

fontAwesomeConfig.autoAddCss = false

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
    if (jssStyles?.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  addAlert = (alert) =>
    this.setState((state, _) => {
      const newAlerts = state.alerts.concat(alert)
      return { alerts: newAlerts }
    })

  removeAlert = (alert) =>
    this.setState({ alerts: this.state.alerts.filter((a) => a !== alert) })

  render() {
    const {
      Component,
      pageProps,
      apollo,
      admin,
      lng,
      url,
      hrefUrl,
      currentUser,
    } = this.props

    // give router to translator to get query parameters
    const t = getPageTranslator(lng, Router.router)
    const titleString = t("title", { title: "..." })?.[hrefUrl]

    const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <LoginStateContext.Provider value={this.state}>
                <LanguageContext.Provider
                  value={{ language: lng, url, hrefUrl }}
                >
                  <ConfirmProvider>
                    <AlertContext.Provider
                      value={{
                        alerts: this.state.alerts,
                        addAlert: this.addAlert,
                        removeAlert: this.removeAlert,
                      }}
                    >
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </AlertContext.Provider>
                  </ConfirmProvider>
                </LanguageContext.Provider>
              </LoginStateContext.Provider>
            </ApolloProvider>
          </MuiThemeProvider>
        </StylesProvider>
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
  if (originalUrl.match(/^\/en\/?$/)) {
    url = "/"
  } else if (originalUrl.startsWith("/en")) {
    url = originalUrl.replace("/en/", "/fi/")
  } else if (originalUrl.startsWith("/se")) {
    url = originalUrl.replace("/se/", "/fi/")
  } else if (originalUrl.startsWith("/fi")) {
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
      ctx?.res.writeHead(302, { location: "/404" })
      ctx?.res.end()
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
    url: createPath(url),
    hrefUrl,
  }
}

export default withApolloClient(MyApp)
