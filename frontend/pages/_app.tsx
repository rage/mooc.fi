import "@fortawesome/fontawesome-svg-core/styles.css"

import { useCallback, useEffect, useReducer } from "react"

import AlertContext, { Alert } from "/contexts/AlertContext"
import { Breadcrumb, BreadcrumbContext } from "/contexts/BreadcrumbContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { initGA, logPageView } from "/lib/gtag"
import withApolloClient from "/lib/with-apollo-client"
import { fontCss } from "/src/fonts"
import theme from "/src/theme"
import {
  AlertActionType,
  BreadcrumbActionType,
  rootReducer,
  UserActionType,
} from "/state"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"
import { ConfirmProvider } from "material-ui-confirm"
import { NextPageContext } from "next"
import App, { AppContext, AppInitialProps, type AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CacheProvider, EmotionCache, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import createEmotionCache from "../src/createEmotionCache"
import Layout from "./_layout"

fontAwesomeConfig.autoAddCss = false

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  currentUser: any
  signedIn: boolean
  admin: boolean
}
export function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
  signedIn,
  admin,
  currentUser,
}: MyAppProps) {
  console.log("pageProps", pageProps)
  console.log("signedIn, admin, currentUser", signedIn, admin, currentUser)

  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const logInOrOut = useCallback(
    () => dispatch({ type: UserActionType.LogInOrOut }),
    [],
  )

  const updateUser = useCallback(
    (payload: { user: UserOverView_currentUser; admin?: boolean }) =>
      dispatch({ type: UserActionType.UpdateUser, payload }),
    [],
  )

  const setBreadcrumbs = useCallback(
    (breadcrumbs: Breadcrumb[]) =>
      dispatch({
        type: BreadcrumbActionType.SetBreadcrumbs,
        payload: breadcrumbs,
      }),
    [],
  )

  const addAlert = useCallback(
    (alert: Alert) =>
      dispatch({ type: AlertActionType.AddAlert, payload: alert }),
    [],
  )
  const removeAlert = useCallback(
    (alert: Alert) =>
      dispatch({ type: AlertActionType.RemoveAlert, payload: alert }),
    [],
  )

  const [state, dispatch] = useReducer(rootReducer, {
    user: {
      loggedIn: signedIn,
      logInOrOut,
      admin,
      validated: pageProps?.validated,
      currentUser,
      updateUser,
    },
    alerts: {
      data: [],
      nextId: 0,
    },
    breadcrumbs: {
      data: [],
    },
  })

  useEffect(() => {
    const newestAlert = state.alerts.data.slice(-1)[0]

    let timeout: NodeJS.Timeout

    if (newestAlert?.timeout) {
      timeout = setTimeout(() => {
        removeAlert(newestAlert)
      }, newestAlert.timeout)
    }

    return () => timeout && clearTimeout(timeout)
  }, [state.alerts.data])

  useEffect(() => {
    if (currentUser !== state.user.currentUser) {
      dispatch({
        type: UserActionType.UpdateUser,
        payload: { user: currentUser, admin },
      })
    }
  }, [state.user.currentUser])

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
          <LoginStateContext.Provider value={state.user}>
            <ConfirmProvider>
              <BreadcrumbContext.Provider
                value={{
                  breadcrumbs: state.breadcrumbs.data,
                  setBreadcrumbs: setBreadcrumbs,
                }}
              >
                <AlertContext.Provider
                  value={{
                    alerts: state.alerts.data,
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

const isAppContext = (ctx: AppContext | NextPageContext): ctx is AppContext => {
  return "Component" in ctx
}
MyApp.getInitialProps = async (appContext: AppContext | NextPageContext) => {
  const ctx = isAppContext(appContext) ? appContext.ctx : appContext

  const appProps = isAppContext(appContext)
    ? await App.getInitialProps(appContext)
    : ({} as AppInitialProps)

  const componentInitialProps =
    isAppContext(appContext) && appContext.Component.getInitialProps
      ? await appContext?.Component?.getInitialProps(ctx)
      : {}

  appProps.pageProps = {
    ...appProps.pageProps,
    ...componentInitialProps,
  }

  return { ...appProps }
}

export default withApolloClient(MyApp)
