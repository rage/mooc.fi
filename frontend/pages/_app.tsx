import { useInsertionEffect, useMemo } from "react"

import { DefaultSeo } from "next-seo"
import type { AppContext, AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"
import Script from "next/script"

import { NormalizedCacheObject } from "@apollo/client"
import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import DynamicLayout from "/components/DynamicLayout"
import AppContextProvider from "/contexts/AppContextProvider"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import useAlternateLanguage from "/hooks/useAlternateLanguage"
import useIsOld from "/hooks/useIsOld"
import { useScrollToHash } from "/hooks/useScrollToHash"
import useSeoConfig from "/hooks/useSeoConfig"
import useThemeWithLocale from "/hooks/useThemeWithLocale"
import { getAccessToken, isAdmin, isSignedIn } from "/lib/authentication"
import withApolloClient from "/lib/with-apollo-client"

import { UserDetailedFieldsFragment } from "/graphql/generated"

interface MyPageProps {
  signedIn?: boolean
  admin?: boolean
  currentUser?: UserDetailedFieldsFragment
  accessToken?: string
}

interface MyAppProps extends AppProps<MyPageProps> {
  deviceType?: string
  apolloState?: NormalizedCacheObject
}

export function MyApp({ Component, pageProps, deviceType }: MyAppProps) {
  const { signedIn, admin, currentUser } = pageProps ?? {}

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
      loggedIn: signedIn ?? false,
      admin: admin ?? false,
      currentUser: currentUser,
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

// @ts-ignore: initialProps
const originalGetInitialProps = MyApp.getInitialProps

MyApp.getInitialProps = async (props: AppContext) => {
  const { ctx, Component } = props

  let originalProps: any = {}

  if (originalGetInitialProps) {
    originalProps = (await originalGetInitialProps(props)) ?? {}
  }
  if (!originalProps?.pageProps) {
    originalProps.pageProps = {}
  }
  if (Component.getInitialProps) {
    const originalComponentProps = (await Component.getInitialProps(ctx)) ?? {}
    Object.assign(originalProps.pageProps, originalComponentProps)
  }

  const signedIn = isSignedIn(ctx)
  const admin = signedIn && isAdmin(ctx)
  const accessToken = getAccessToken(ctx)

  return {
    ...originalProps,
    pageProps: {
      ...originalProps.pageProps,
      signedIn,
      admin,
      accessToken,
    },
  }
}

// @ts-ignore: silence for now
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}

export default withApolloClient(MyApp)
