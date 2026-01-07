import { NextPageContext } from "next"
import { AppContext } from "next/app"
import { Router, useRouter } from "next/router"
import { renderToString } from "react-dom/server"

import { ApolloProvider, type ApolloClient } from "@apollo/client"

import fetchUserDetails from "./fetch-user-details"
import getApollo from "./get-apollo"
import { getAccessToken, isSignedIn } from "/lib/authentication"

interface Props {
  apollo: ApolloClient<object>
  // Server side rendered state. Prevents queries from running again in the frontend.
  apolloState: any
  accessToken?: string
  router?: Router
}

const isAppContext = (ctx: AppContext | NextPageContext): ctx is AppContext => {
  // @ts-ignore: ctx.ctx doesn't exist in NextPageContext
  return Boolean(ctx?.ctx)
}

const PUBLIC_ROUTES_NO_SSR = [
  "/",
  "/courses",
  "/about-us",
  "/research",
  "/learning-environment",
  "/teachers",
  "/faq",
  "/installation",
]

const isPublicRoute = (pathname: string): boolean => {
  if (!pathname) return false
  const normalizedPath = pathname.replace(/\/_old/, "").split("?")[0]
  return (
    PUBLIC_ROUTES_NO_SSR.some((route) => normalizedPath === route) ||
    normalizedPath.startsWith("/installation/") ||
    normalizedPath.startsWith("/faq/")
  )
}

const shouldSkipSSR = (
  ctx: NextPageContext | AppContext["ctx"],
  pageProps: any,
): boolean => {
  if (pageProps?.skipSSR === true) {
    return true
  }
  const pathname = ctx?.pathname || ctx?.asPath?.split("?")[0] || ""
  return isPublicRoute(pathname)
}

const shouldFetchUserDetails = (
  ctx: NextPageContext | AppContext["ctx"],
  pageProps: any,
): boolean => {
  if (pageProps?.requireAuth === true) {
    return true
  }
  const signedIn = isSignedIn(ctx)
  if (!signedIn) {
    return false
  }
  const pathname = ctx?.pathname || ctx?.asPath?.split("?")[0] || ""
  const authRequiredRoutes = ["/profile", "/admin", "/dashboard"]
  return authRequiredRoutes.some((route) => pathname.startsWith(route))
}

const withApolloClient = (App: any) => {
  const withApollo = ({
    apollo,
    apolloState,
    accessToken,
    ...pageProps
  }: Props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const locale = router.locale ?? pageProps?.router?.locale
    const apolloClient = getApollo(apolloState, accessToken, locale)

    return (
      <ApolloProvider client={apolloClient}>
        <App {...pageProps} />
      </ApolloProvider>
    )
  }

  withApollo.displayName = `withApollo(${App.displayName ?? "App"})`
  withApollo.getInitialProps = async (
    pageCtx: AppContext | NextPageContext,
  ) => {
    const inAppContext = isAppContext(pageCtx)

    const ctx = inAppContext ? pageCtx.ctx : pageCtx

    const { AppTree } = ctx
    const Component = inAppContext ? pageCtx.Component : undefined

    let pageProps = {} as any
    let apolloState =
      typeof window !== "undefined"
        ? window.__NEXT_DATA__.props.apolloState
        : ({} as any)

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    // @ts-ignore: ctx in ctx

    const accessToken = getAccessToken(ctx)
    // It is important to use a new apollo since the page has changed because
    // 1. access token might have changed
    // 2. We've decided to discard apollo cache between page transitions to avoid bugs.
    //  @ts-ignore: ignore type error on ctx
    const apollo = getApollo(apolloState, accessToken, ctx.locale)

    if (App.getInitialProps) {
      ;(ctx as any).apolloClient = apollo
      pageProps = await App.getInitialProps(pageCtx)
    }

    if (!pageProps.pageProps) {
      pageProps.pageProps = {}
    }

    const skipSSR = shouldSkipSSR(ctx, pageProps)
    const needsUserDetails = shouldFetchUserDetails(ctx, pageProps)

    let currentUser = undefined
    if (needsUserDetails) {
      try {
        currentUser = await fetchUserDetails(apollo)
      } catch (error) {
        console.error("Error fetching user details", error)
      }
    }

    pageProps.pageProps.currentUser = currentUser

    if (typeof window === "undefined" && !skipSSR) {
      if (ctx?.res?.headersSent || ctx?.res?.finished) {
        return pageProps ?? {}
      }
      const props = { ...pageProps, apolloState, apollo }
      const appTreeProps = inAppContext ? props : { pageProps: props }

      const { getMarkupFromTree } = await import("@apollo/client/react/ssr")

      const SSR_TIMEOUT = 3000

      try {
        const getMarkupPromise = getMarkupFromTree({
          renderFunction: renderToString,
          tree: <AppTree {...appTreeProps} Component={Component} />,
        })

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("SSR timeout exceeded"))
          }, SSR_TIMEOUT)
        })

        await Promise.race([getMarkupPromise, timeoutPromise])
      } catch (error) {
        if (error instanceof Error && error.message === "SSR timeout exceeded") {
          console.warn(
            `[SSR] Timeout after ${SSR_TIMEOUT}ms, sending partial HTML. Queries will complete client-side.`,
          )
        } else {
          console.error("Error while running `getMarkupFromTree`", error)
        }
      }
    }

    // Extract query data from the Apollo store
    apolloState = apollo.cache.extract()
    // @ts-ignore: ignore
    apollo.toJSON = () => null

    pageProps.pageProps.apolloState = apolloState

    return {
      ...pageProps,
      accessToken,
      apolloState,
      apollo,
    }
  }

  return withApollo
}

export default withApolloClient
