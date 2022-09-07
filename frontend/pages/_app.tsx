import "@fortawesome/fontawesome-svg-core/styles.css"

import { useCallback, useEffect, useMemo, useReducer } from "react"

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

import {
  CurrentUserQuery,
} from "/graphql/generated"

fontAwesomeConfig.autoAddCss = false

const clientSideEmotionCache = createEmotionCache()

type UpdateUserPayload = {
  user: CurrentUserQuery["currentUser"]
  admin?: boolean
}
interface AppState {
  loggedIn: boolean
  logInOrOut: () => void
  alerts: Alert[]
  breadcrumbs: Breadcrumb[]
  admin: boolean
  validated: boolean
  currentUser: any
  updateUser: (data: UpdateUserPayload) => void
  nextAlertId: number
}
type AppReducerAction =
  | {
      type: "addAlert"
      payload: Alert
    }
  | {
      type: "removeAlert"
      payload: Alert
    }
  | {
      type: "setBreadcrumbs"
      payload: Array<Breadcrumb>
    }
  | {
      type: "updateUser"
      payload: UpdateUserPayload
    }
  | {
      type: "logInOrOut"
    }

const reducer = (state: AppState, action: AppReducerAction) => {
  switch (action.type) {
    case "addAlert":
      console.log("adding alert", action.payload)
      const nextAlertId = state.nextAlertId + 1
      return {
        ...state,
        alerts: [...state.alerts, { ...action.payload, id: nextAlertId }],
        nextAlertId,
      }
    case "removeAlert":
      console.log("removing alert", action.payload)
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload.id),
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

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const logInOrOut = useCallback(() => dispatch({ type: "logInOrOut" }), [])

  const updateUser = useCallback(
    (data: UpdateUserPayload) =>
      dispatch({ type: "updateUser", payload: data }),
    [],
  )

  const addAlert = useCallback(
    (alert: Alert) => dispatch({ type: "addAlert", payload: alert }),
    [],
  )

  const removeAlert = useCallback(
    (alert: Alert) => dispatch({ type: "removeAlert", payload: alert }),
    [],
  )

  const setBreadcrumbs = useCallback(
    (breadcrumbs: Breadcrumb[]) =>
      dispatch({ type: "setBreadcrumbs", payload: breadcrumbs }),
    [],
  )

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

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: state.loggedIn,
      logInOrOut,
      admin: state.admin,
      currentUser: state.currentUser,
      updateUser,
    }),
    [state.loggedIn, state.admin, state.currentUser],
  )
  const breadcrumbContextValue = useMemo(
    () => ({ breadcrumbs: state.breadcrumbs, setBreadcrumbs }),
    [state.breadcrumbs],
  )
  const alertContextValue = useMemo(
    () => ({ alerts: state.alerts, addAlert, removeAlert }),
    [state.alerts],
  )

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
          <LoginStateContext.Provider value={loginStateContextValue}>
            <ConfirmProvider>
              <BreadcrumbContext.Provider value={breadcrumbContextValue}>
                <AlertContext.Provider value={alertContextValue}>
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
