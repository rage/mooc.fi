import "@fortawesome/fontawesome-svg-core/styles.css"

import { useEffect } from "react"

import { CacheProvider, EmotionCache, Global } from "@emotion/react"
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { NextPageContext } from "next"
import App, { AppContext, AppInitialProps, type AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import createEmotionCache from "../src/createEmotionCache"
import Layout from "./_layout"
import { AppContextProvider } from "/contexts/AppContext"
import { useLogPageView } from "/hooks/useLogPageView"
import withApolloClient from "/lib/with-apollo-client"
import { fontCss } from "/src/fonts"
import theme from "/src/theme"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"

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
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  useLogPageView()
  useEffect(() => {
    // these don't necessarily exist anymore
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

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
          <AppContextProvider
            currentUser={currentUser}
            signedIn={signedIn}
            admin={admin}
            validated={pageProps?.validated}
          >
            <Layout>
              <Global styles={fontCss} />
              <Component {...pageProps} />
            </Layout>
          </AppContextProvider>
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
