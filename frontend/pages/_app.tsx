import "@fortawesome/fontawesome-svg-core/styles.css"

import { useEffect, useState } from "react"

import AlertContext, { Alert } from "/contexts/AlertContext"
import { Breadcrumb, BreadcrumbContext } from "/contexts/BreadcrumbContext"
import LanguageContext from "/contexts/LanguageContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { initGA, logPageView } from "/lib/gtag"
import withApolloClient from "/lib/with-apollo-client"
import { fontCss } from "/src/fonts"
import theme from "/src/theme"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"
import { ConfirmProvider } from "material-ui-confirm"
import type { AppContext, AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import createCache from "@emotion/cache"
import { CacheProvider, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/core/styles"

import Layout from "./_layout"

fontAwesomeConfig.autoAddCss = false

export const cache = createCache({ key: "css", prepend: true })

interface AppState {
  loggedIn: boolean
  logInOrOut: () => void
  alerts: Alert[]
  breadcrumbs: Breadcrumb[]
  admin: boolean
  validated: boolean
  currentUser: any
  updateUser: (user: any) => void
}

export function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const logInOrOut = () =>
    setState((prevState) => ({
      ...prevState,
      loggedIn: !prevState.loggedIn,
    }))

  const updateUser = (user: any) =>
    setState((prevState) => ({
      ...prevState,
      currentUser: user,
    }))

  const addAlert = (alert: Alert) =>
    setState((prevState) => ({
      ...prevState,
      alerts: prevState.alerts.concat(alert),
    }))

  const removeAlert = (alert: Alert) =>
    setState((prevState) => ({
      ...prevState,
      alerts: prevState.alerts.filter((a) => a !== alert),
    }))

  const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) =>
    setState((prevState) => ({
      ...prevState,
      breadcrumbs,
    }))

  const [state, setState] = useState<AppState>({
    loggedIn: pageProps?.signedIn,
    logInOrOut,
    alerts: [],
    breadcrumbs: [],
    admin: pageProps?.admin,
    validated: pageProps?.validated,
    currentUser: pageProps?.currentUser,
    updateUser,
  })

  useEffect(() => {
    if (pageProps?.currentUser !== state.currentUser) {
      setState((prevState) => ({
        ...prevState,
        currentUser: pageProps?.currentUser,
        admin: pageProps?.admin,
      }))
    }
  }, [pageProps?.currentUser])

  useEffect(() => {
    initGA()
    logPageView()

    router.events.on("routeChangeComplete", logPageView)

    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }

    return () => {
      router.events.off("routeChangeComplete", logPageView)
    }
  }, [router])

  const {
    lng = "fi",
    languageSwitchUrl = "/en/",
    asUrl = "/",
    hrefUrl,
  } = pageProps

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
          <LoginStateContext.Provider value={state}>
            <LanguageContext.Provider
              value={{ language: lng, url: languageSwitchUrl, hrefUrl }}
            >
              <ConfirmProvider>
                <BreadcrumbContext.Provider
                  value={{
                    breadcrumbs: state.breadcrumbs,
                    setBreadcrumbs: setBreadcrumbs,
                  }}
                >
                  <AlertContext.Provider
                    value={{
                      alerts: state.alerts,
                      addAlert: addAlert,
                      removeAlert: removeAlert,
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

// @ts-ignore: initialProps
const originalGetInitialProps = MyApp.getInitialProps

const languages = ["en", "fi", "se"]

function createPath(originalUrl: string) {
  let url = ""
  /*   if (originalUrl === "/") {
    url = "/en/"
  } else  */
  if (originalUrl?.match(/^\/en\/?$/)) {
    url = "/"
  } else if (originalUrl?.startsWith("/en")) {
    url = originalUrl.replace("/en", "/fi")
  } else if (originalUrl?.startsWith("/se")) {
    url = originalUrl.replace("/se", "/fi")
  } else if (originalUrl?.startsWith("/fi")) {
    url = originalUrl.replace("/fi", "/en")
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

MyApp.getInitialProps = async (props: AppContext) => {
  const { ctx, Component } = props
  /*let validated = true

  if (ctx.req?.url?.indexOf("/_next/data/") === -1) {
    // server
    validated = await validateToken("tmc", DOMAIN, ctx)
    // validated = await validateToken("tmc", DOMAIN, ctx)
  }*/

  let lng = "fi"
  let asUrl = "/"
  let hrefUrl = "/"

  if (typeof window !== "undefined") {
    if (languages.includes(ctx?.asPath?.substring(1, 3) ?? "")) {
      lng = ctx?.asPath?.substring(1, 3) ?? ""
    }

    asUrl = ctx?.asPath ?? ""
    hrefUrl = ctx.pathname
  } else {
    const maybeLng = (ctx.query.lng as string) ?? "fi"

    if (languages.includes(maybeLng)) {
      lng = maybeLng
    } else {
      ctx?.res?.writeHead(302, { location: "/404" })
      ctx?.res?.end()
    }

    // @ts-ignore: TODO: check what it really is
    asUrl = ctx?.req?.originalUrl ?? ""
    hrefUrl = ctx.pathname //.req.path
  }

  let originalProps: any = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) || {}
  }
  if (Component.getInitialProps) {
    originalProps = {
      ...originalProps,
      pageProps: {
        ...originalProps?.pageProps,
        ...((await Component.getInitialProps(ctx)) || {}),
      },
    }
  }

  /*if (hrefUrl !== "/" && !hrefUrl.startsWith("/[lng]")) {
    hrefUrl = `/[lng]${hrefUrl}`
  }*/

  // console.log(validated)
  const signedIn = isSignedIn(ctx)
  const admin = isAdmin(ctx)

  return {
    ...originalProps,
    pageProps: {
      ...originalProps.pageProps,
      // validated,
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
