// import "@fortawesome/fontawesome-free/css/all.min.css"
import { PropsWithChildren, useEffect, useMemo, useState } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import { NextPageContext } from "next"
import type { AppContext, AppInitialProps, AppProps } from "next/app"
import App from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { CssBaseline, GlobalStyles } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import OriginalLayout from "./_layout"
import NewLayout from "./_new/_layout"
import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import { useLogPageView } from "/hooks/useLogPageView"
import { useScrollToHash } from "/hooks/useScrollToHash"
import withApolloClient from "/lib/with-apollo-client"
import { createEmotionSsr } from "/src/createEmotionSsr"
import { fontCss } from "/src/fonts"
import newTheme, { newFontCss } from "/src/newTheme"
import originalTheme from "/src/theme"
import PagesTranslations from "/translations/pages"
import { useTranslator } from "/util/useTranslator"

import { CurrentUserQuery } from "/graphql/generated"

const { withAppEmotionCache, augmentDocumentWithEmotionCache } =
  createEmotionSsr({
    key: "emotion-css",
  })

export { augmentDocumentWithEmotionCache }

interface MyAppProps extends AppProps {
  currentUser: CurrentUserQuery["currentUser"]
  signedIn: boolean
  admin: boolean
}

// @ts-ignore: not used, try as workaround for SSR hydration problems
function Hydrated(props: PropsWithChildren<any>) {
  const [hydration, setHydration] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHydration(true)
    }
  }, [])

  if (hydration) {
    return props.children
  }

  return null
}

export function MyApp({
  Component,
  pageProps,
  currentUser,
  signedIn,
  admin,
}: MyAppProps) {
  const router = useRouter()
  const t = useTranslator(PagesTranslations)

  const isNew = router.pathname?.includes("_new")

  useLogPageView()
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

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: signedIn,
      admin,
      currentUser,
    }),
    [signedIn, admin, currentUser],
  )

  const alternateLanguage = useMemo(() => {
    if (router.locale === "en") {
      return { hrefLang: "fi_FI", href: router.asPath.replace("/en/", "/") }
    }
    return { hrefLang: "en_US", href: `/en${router.asPath}` }
  }, [router.locale, router.pathname])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link rel="alternate" {...alternateLanguage} />
        <title>{title}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginStateProvider value={loginStateContextValue}>
          <ConfirmProvider>
            <BreadcrumbProvider>
              <AlertProvider>
                <Layout>
                  <GlobalStyles styles={fontCss} />
                  {isNew && <GlobalStyles styles={newFontCss} />}
                  <Component {...pageProps} />
                </Layout>
              </AlertProvider>
            </BreadcrumbProvider>
          </ConfirmProvider>
        </LoginStateProvider>
      </ThemeProvider>
    </>
  )
}

// @ts-ignore: initialProps
const originalGetInitialProps = MyApp.getInitialProps

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
      ? await appContext.Component.getInitialProps(ctx)
      : {}

  appProps.pageProps = {
    ...appProps.pageProps,
    ...componentInitialProps,
  }

  return appProps
}

export default withAppEmotionCache(withApolloClient(MyApp))
