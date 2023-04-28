import { useEffect, useMemo } from "react"

import { DefaultSeo } from "next-seo"
import type { AppContext, AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import DynamicLayout from "/components/DynamicLayout"
import AppContextProvider from "/contexts/AppContextProvider"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import useAlternateLanguage from "/hooks/useAlternateLanguage"
import useIsNew from "/hooks/useIsNew"
import { useScrollToHash } from "/hooks/useScrollToHash"
import useSeoConfig from "/hooks/useSeoConfig"
import useThemeWithLocale from "/hooks/useThemeWithLocale"
import { isAdmin, isSignedIn } from "/lib/authentication"
import withApolloClient from "/lib/with-apollo-client"
import { createEmotionSsr } from "/src/createEmotionSsr"

import { UserDetailedFieldsFragment } from "/graphql/generated"

const { withAppEmotionCache, augmentDocumentWithEmotionCache } =
  createEmotionSsr({
    key: "emotion-css",
  })

export { augmentDocumentWithEmotionCache }

export function MyApp({
  Component,
  pageProps,
  deviceType,
}: AppProps<{
  signedIn?: boolean
  admin?: boolean
  currentUser?: UserDetailedFieldsFragment
}> & { deviceType?: string }) {
  useEffect(() => {
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useScrollToHash()

  const isNew = useIsNew()
  const seoConfig = useSeoConfig()
  const themeWithLocale = useThemeWithLocale(deviceType)
  const alternateLanguage = useAlternateLanguage()

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: pageProps?.signedIn ?? false,
      admin: pageProps?.admin ?? false,
      currentUser: pageProps?.currentUser,
    }),
    [pageProps?.signedIn, pageProps?.admin, pageProps?.currentUser],
  )

  return (
    <>
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
          <AppContextProvider>
            <DynamicLayout isNew={isNew}>
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

  Object.assign(originalProps.pageProps, { signedIn, admin })
  return originalProps
  /*return {
    ...originalProps,
    pageProps: {
      ...originalProps.pageProps,
      signedIn,
      admin,
    },
  }*/
}

// @ts-ignore: silence for now
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}

export default withAppEmotionCache(withApolloClient(MyApp))
