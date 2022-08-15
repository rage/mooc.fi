import "@fortawesome/fontawesome-svg-core/styles.css"

import { useEffect, useReducer } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import type { AppContext, AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CacheProvider, EmotionCache, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import createEmotionCache from "../src/createEmotionCache"
import Layout from "./_layout"
import AlertContext, { Alert } from "/contexts/AlertContext"
import { Breadcrumb, BreadcrumbContext } from "/contexts/BreadcrumbContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { initGA, logPageView } from "/lib/gtag"
import withApolloClient from "/lib/with-apollo-client"
import { fontCss } from "/src/fonts"
import theme from "/src/theme"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"

fontAwesomeConfig.autoAddCss = false

const clientSideEmotionCache = createEmotionCache()

interface AppState {
  loggedIn: boolean
  logInOrOut: () => void
  alerts: Alert[]
  breadcrumbs: Breadcrumb[]
  admin: boolean
  validated: boolean
  currentUser: any
  updateUser: (user: any) => void
  nextAlertId: number
}
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const reducer = (state: AppState, action: any) => {
  switch (action.type) {
    case "addAlert":
      const nextAlertId = state.nextAlertId + 1
      return {
        ...state,
        alerts: [...state.alerts, { ...action.payload, id: nextAlertId }],
        nextAlertId,
      }
    case "removeAlert":
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      }
    case "setBreadcrumbs":
      return {
        ...state,
        breadcrumbs: action.payload,
      }
    case "updateUser":
      return {
        ...state,
        currentUser: action.payload.user,
        admin: action.payload.admin || false,
      }
    case "logInOrOut":
      return {
        ...state,
        loggedIn: !state.loggedIn,
      }
    default:
      return state
  }
}

export function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const logInOrOut = () => dispatch({ type: "logInOrOut" })

  const updateUser = (user: any) =>
    dispatch({ type: "updateUser", payload: { user } })

  const addAlert = (alert: Alert) =>
    dispatch({ type: "addAlert", payload: alert })

  const removeAlert = (alert: Alert) =>
    dispatch({ type: "removeAlert", payload: alert })

  const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) =>
    dispatch({ type: "setBreadcrumbs", payload: breadcrumbs })

  const [state, dispatch] = useReducer(reducer, {
    loggedIn: pageProps?.signedIn,
    logInOrOut,
    alerts: [],
    breadcrumbs: [],
    admin: pageProps?.admin,
    validated: pageProps?.validated,
    currentUser: pageProps?.currentUser,
    updateUser,
    nextAlertId: 0,
  })

  useEffect(() => {
    if (pageProps?.currentUser !== state.currentUser) {
      dispatch({
        type: "updateUser",
        payload: { user: pageProps?.currentUser, admin: pageProps?.admin },
      })
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

  const titleString = t("title", { title: "..." })?.[router?.pathname ?? ""]

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
          <LoginStateContext.Provider value={state}>
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
          </LoginStateContext.Provider>
        </ThemeProvider>
      </CacheProvider>
    </>
  )
}

// @ts-ignore: initialProps
const originalGetInitialProps = MyApp.getInitialProps

MyApp.getInitialProps = async (props: AppContext) => {
  const { ctx, Component } = props

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

  const signedIn = isSignedIn(ctx)
  const admin = isAdmin(ctx)

  return {
    ...originalProps,
    pageProps: {
      ...originalProps.pageProps,
      signedIn,
      admin,
    },
  }
}

export default withApolloClient(MyApp)
