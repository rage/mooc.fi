import React, { useEffect, useMemo } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import { DefaultSeo, DefaultSeoProps } from "next-seo"
import type { AppContext, AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CircularProgress, CssBaseline, LinearProgress } from "@mui/material"
import { fiFI } from "@mui/material/locale"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"

import OriginalLayout from "./_layout"
import NewLayout from "./_new/_layout"
import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import { SnackbarProvider } from "/contexts/SnackbarContext"
import usePageLoadProgress from "/hooks/usePageLoadProgress"
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

const FixedLinearProgress = styled(LinearProgress)`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  z-index: 10000;
`

const FixedCircularProgress = styled(CircularProgress)`
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 10000;
`

const defaultSeoConfig: DefaultSeoProps = {
  titleTemplate: "%s - MOOC.fi",
  defaultTitle: "MOOC.fi",
}

export function MyApp({ Component, pageProps }: AppProps) {
  const t = useTranslator(PagesTranslations)
  const { loading, loadingTakingLong } = usePageLoadProgress()

  const router = useRouter()
  const { locale = "fi" } = router

  const isNew = router.pathname?.includes("_new")

  useEffect(() => {
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useScrollToHash()

  const Layout = isNew ? NewLayout : OriginalLayout

  const theme = isNew ? newTheme : originalTheme
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

  const seoConfig = useMemo(() => {
    const titleTemplates = t("titleTemplate")
    const titleTemplate =
      titleTemplates?.[router?.pathname ?? ""] ??
      titleTemplates?.[router?.asPath ?? ""]

    if (titleTemplate) {
      return {
        ...defaultSeoConfig,
        titleTemplate: `${titleTemplate} - MOOC.fi`,
        defaultTitle: `${titleTemplate.replace(" - %s", "")} - MOOC.fi`,
      }
    }
    return defaultSeoConfig
  }, [router.pathname, t])

  return (
    <React.StrictMode>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link rel="alternate" {...alternateLanguage} />
      </Head>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        <LoginStateProvider value={loginStateContextValue}>
          <ConfirmProvider>
            <BreadcrumbProvider>
              <AlertProvider>
                <SnackbarProvider>
                  {loading && <FixedLinearProgress />}
                  {loadingTakingLong && <FixedCircularProgress size={15} />}
                  <Layout>
                    <DefaultSeo {...seoConfig} />
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
