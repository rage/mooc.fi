import React, { useEffect, useMemo } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import type { AppContext, AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CssBaseline } from "@mui/material"
import { fiFI } from "@mui/material/locale"
import { createTheme, ThemeProvider } from "@mui/material/styles"

import OriginalLayout from "./_layout"
import NewLayout from "./_new/_layout"
import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import { SnackbarProvider } from "/contexts/SnackbarContext"
import { useScrollToHash } from "/hooks/useScrollToHash"
import { useTranslator } from "/hooks/useTranslator"
import { isAdmin, isSignedIn } from "/lib/authentication"
import withApolloClient from "/lib/with-apollo-client"
import { createEmotionSsr } from "/src/createEmotionSsr"
import newTheme from "/src/newTheme"
import originalTheme from "/src/theme"
import PagesTranslations from "/translations/pages"

const { withAppEmotionCache, augmentDocumentWithEmotionCache } =
  createEmotionSsr({
    key: "emotion-css",
  })

export { augmentDocumentWithEmotionCache }

export function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const isNew = router.pathname?.includes("_new")

  useEffect(() => {
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useScrollToHash()

  const titleString = t("title", { title: "..." })?.[router?.pathname ?? ""]

  const title = `${titleString ? titleString + " - " : ""}MOOC.fi`

  const Layout = isNew ? NewLayout : OriginalLayout
  const theme = isNew ? newTheme : originalTheme
  const { locale = "fi" } = router
  const themeWithLocale = useMemo(
    () => (locale === "fi" ? createTheme(theme, fiFI) : theme),
    [theme, locale],
  )

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: pageProps?.signedIn,
      admin: pageProps?.admin,
      currentUser: pageProps?.currentUser,
    }),
    [pageProps?.loggedIn, pageProps?.admin, pageProps?.currentUser],
  )

  const alternateLanguage = useMemo(() => {
    if (router.locale === "en") {
      return { hrefLang: "fi_FI", href: router.asPath.replace("/en/", "/") }
    }
    return { hrefLang: "en_US", href: `/en${router.asPath}` }
  }, [router.locale, router.pathname])

  return (
    <React.StrictMode>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link rel="alternate" {...alternateLanguage} />
        <title>{title}</title>
      </Head>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        <LoginStateProvider value={loginStateContextValue}>
          <ConfirmProvider>
            <BreadcrumbProvider>
              <AlertProvider>
                <SnackbarProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </SnackbarProvider>
              </AlertProvider>
            </BreadcrumbProvider>
          </ConfirmProvider>
        </LoginStateProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

// @ts-ignore: initialProps
const originalGetInitialProps = MyApp.getInitialProps

MyApp.getInitialProps = async (props: AppContext) => {
  const { ctx, Component } = props

  let originalProps: any = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) ?? {}
  }
  if (Component.getInitialProps) {
    originalProps = {
      ...originalProps,
      pageProps: {
        ...originalProps?.pageProps,
        ...((await Component.getInitialProps(ctx)) ?? {}),
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

// @ts-ignore: silence for now
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}

export default withAppEmotionCache(withApolloClient(MyApp))
