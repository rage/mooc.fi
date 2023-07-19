import { NextPageContext } from "next"
import { AppContext } from "next/app"
import { Router, useRouter } from "next/router"
import { renderToString } from "react-dom/server"

import { ApolloProvider, type ApolloClient } from "@apollo/client"

import fetchUserDetails from "./fetch-user-details"
import getApollo from "./get-apollo"
import { getAccessToken } from "/lib/authentication"

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
    const apolloClient = apollo ?? getApollo(apolloState, accessToken, locale)

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
    const currentUser = await fetchUserDetails(apollo)

    if (App.getInitialProps) {
      ;(ctx as any).apolloClient = apollo
      pageProps = await App.getInitialProps(pageCtx)
    }

    pageProps.pageProps.currentUser = currentUser
    if (typeof window === "undefined") {
      if (ctx?.res?.headersSent || ctx?.res?.finished) {
        return pageProps ?? {}
      }
      const props = { ...pageProps, apolloState, apollo }
      const appTreeProps = inAppContext ? props : { pageProps: props }

      const { getMarkupFromTree } = await import("@apollo/client/react/ssr")

      // Run the graphql queries on server and pass the results to frontend by using the Apollo cache.

      try {
        // getDataFromTree is using getMarkupFromTree anyway?
        await getMarkupFromTree({
          renderFunction: renderToString,
          tree: <AppTree {...appTreeProps} Component={Component} />,
        })
        /*const rendered = await renderToStringWithData(
          <AppTree {...appTreeProps} Component={Component} />
        )*/
        // Run all GraphQL queries
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error)
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
