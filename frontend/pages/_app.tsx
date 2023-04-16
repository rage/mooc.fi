import { useEffect, useMemo } from "react"

import { DefaultSeo } from "next-seo"
import type { AppContext, AppProps, NextWebVitalsMetric } from "next/app"
import Head from "next/head"

import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import AppContextProvider from "/contexts/AppContextProvider"
import useAlternateLanguage from "/hooks/useAlternateLanguage"
import { useScrollToHash } from "/hooks/useScrollToHash"
import useSeoConfig from "/hooks/useSeoConfig"
import useThemeWithLocale from "/hooks/useThemeWithLocale"
import { isAdmin, isSignedIn } from "/lib/authentication"
import withApolloClient from "/lib/with-apollo-client"
import { createEmotionSsr } from "/src/createEmotionSsr"
import DynamicLayout from "/components/DynamicLayout"
import { LoginStateProvider } from "/contexts/LoginStateContext"
import { UserDetailedFieldsFragment } from "/graphql/generated"

const { withAppEmotionCache, augmentDocumentWithEmotionCache } =
  createEmotionSsr({
    key: "emotion-css",
  })

export { augmentDocumentWithEmotionCache }

export function MyApp({ Component, pageProps, ...props }: AppProps<{
  signedIn?: boolean
  admin?: boolean
  currentUser?: UserDetailedFieldsFragment
}>) {
  console.log("got props", pageProps, props)
  useEffect(() => {
    const jssStyles = document?.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useScrollToHash()

  const seoConfig = useSeoConfig()
  const themeWithLocale = useThemeWithLocale()
  const alternateLanguage = useAlternateLanguage()

  const loginStateContextValue = useMemo(
    () => ({
      loggedIn: pageProps?.signedIn ?? false,
      admin: pageProps?.admin ?? false,
      currentUser: pageProps?.currentUser,
    }),
    [pageProps?.signedIn, pageProps?.admin, pageProps?.currentUser],
  )

  console.log("loginStateContextValue", loginStateContextValue)
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
            <DynamicLayout>
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
