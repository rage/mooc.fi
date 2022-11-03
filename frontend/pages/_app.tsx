import "@fortawesome/fontawesome-svg-core/styles.css"

import React, { useEffect, useMemo } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import type { AppContext, AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CacheProvider, EmotionCache } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import createEmotionCache from "../src/createEmotionCache"
import OriginalLayout from "./_layout"
import NewLayout from "./_new/_layout"
import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import { useScrollToHash } from "/hooks/useScrollToHash"
import { isAdmin, isSignedIn } from "/lib/authentication"
import { initGA, logPageView } from "/lib/gtag"
import withApolloClient from "/lib/with-apollo-client"
// import { fontCss } from "/src/fonts"
import newTheme from "/src/newTheme"
import originalTheme from "/src/theme"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"

fontAwesomeConfig.autoAddCss = false

const clientSideEmotionCache = createEmotionCache()

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

  const isNew = router.pathname?.includes("_new")

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

  useScrollToHash()

  const titleString = t("title", { title: "..." })?.[router?.pathname ?? ""]

  const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

  const Layout = isNew ? NewLayout : OriginalLayout
  const theme = isNew ? newTheme : originalTheme
  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: pageProps?.signedIn,
      admin: pageProps?.admin,
      currentUser: pageProps?.currentUser,
    }),
    [pageProps?.loggedIn, pageProps?.admin, pageProps?.currentUser],
  )

  return (
    <React.StrictMode>
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
          <LoginStateProvider value={loginStateContextValue}>
            <ConfirmProvider>
              <BreadcrumbProvider>
                <AlertProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </AlertProvider>
              </BreadcrumbProvider>
            </ConfirmProvider>
          </LoginStateProvider>
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
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
  const admin = signedIn && isAdmin(ctx)

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
