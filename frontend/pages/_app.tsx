import { useInsertionEffect, useMemo } from "react"

import { DefaultSeo } from "next-seo"
import type { AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"
import Script from "next/script"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import DynamicLayout from "/components/DynamicLayout"
import AppContextProvider from "/contexts/AppContextProvider"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import useAlternateLanguage from "/hooks/useAlternateLanguage"
import { useAuth } from "/hooks/useAuth"
import useIsOld from "/hooks/useIsOld"
import { useScrollToHash } from "/hooks/useScrollToHash"
import useSeoConfig from "/hooks/useSeoConfig"
import useThemeWithLocale from "/hooks/useThemeWithLocale"
import withApolloClient from "/lib/with-apollo-client"

interface MyAppProps extends AppProps {
  deviceType?: string
}

export function MyApp({ Component, pageProps, deviceType }: MyAppProps) {
  const { signedIn, admin, currentUser } = useAuth()

  useInsertionEffect(() => {
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useScrollToHash()

  const isOld = useIsOld()
  const seoConfig = useSeoConfig()
  const themeWithLocale = useThemeWithLocale(deviceType)
  const alternateLanguage = useAlternateLanguage()

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: signedIn,
      admin: admin,
      currentUser: currentUser ?? undefined,
    }),
    [signedIn, admin, currentUser],
  )

  // test for container query support
  const supportsContainerQueries =
    typeof document !== "undefined" &&
    "container" in document.documentElement.style

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link rel="alternate" {...alternateLanguage} />
        {!supportsContainerQueries && (
          <Script
            id="container-query-polyfill"
            src="https://cdn.jsdelivr.net/npm/container-query-polyfill@1/dist/container-query-polyfill.modern.js"
          />
        )}
      </Head>
      <ThemeProvider theme={themeWithLocale}>
        <CssBaseline />
        <LoginStateProvider value={loginStateContextValue}>
          <AppContextProvider>
            <DynamicLayout isOld={isOld}>
              <DefaultSeo {...seoConfig} />
              <Component {...pageProps} />
            </DynamicLayout>
          </AppContextProvider>
        </LoginStateProvider>
      </ThemeProvider>
    </>
  )
}

// @ts-ignore: silence for now
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}

export default withApolloClient(MyApp)
