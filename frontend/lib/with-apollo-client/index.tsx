import {
  getAccessToken,
  isAdmin,
  isSignedIn,
} from "/lib/authentication"
import { NextPageContext } from "next"
import { AppContext } from "next/app"

import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client"

import fetchUserDetails from "./fetch-user-details"
import getApollo, { initNewApollo } from "./get-apollo"

interface Props {
  apollo: ApolloClient<NormalizedCacheObject>
  // Server side rendered state. Prevents queries from running again in the frontend.
  apolloState: any
  accessToken?: string
}

const isAppContext = (ctx: AppContext | NextPageContext): ctx is AppContext => {
  return 'Component' in ctx
}

const withApolloClient = (App: any) => {
  const withApollo = ({
    apollo,
    apolloState,
    accessToken,
    ...pageProps
  }: Props) => {
    const apolloClient = apollo ?? getApollo(apolloState?.data, accessToken)
    return (
      <ApolloProvider client={apolloClient}>
        <App {...pageProps} />
      </ApolloProvider>
    )
  }

  withApollo.displayName = "withApollo(App)"
  withApollo.getInitialProps = async (pageCtx: AppContext | NextPageContext) => {
    const inAppContext = isAppContext(pageCtx)
    const ctx = inAppContext ? pageCtx.ctx : pageCtx

    const { AppTree } = pageCtx

    let pageProps = {} as any
    const apolloState = {} as any
 
    // @ts-ignore: ctx in ctx
    // const inAppContext = Boolean(ctx?.ctx)

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    // @ts-ignore: ctx in ctx
    const accessToken = getAccessToken(ctx)
    // It is important to use a new apollo since the page has changed because
    // 1. access token might have changed
    // 2. We've decided to discard apollo cache between page transitions to avoid bugs.
    //  @ts-ignore: ignore type error on ctx
    const apollo = initNewApollo(accessToken)

    if (App.getInitialProps) {
      (ctx as any).apolloClient = apollo 
      pageProps = await App.getInitialProps(pageCtx)
    }

    // UserDetailsContext uses this
    const currentUser = await fetchUserDetails(apollo)
    const signedIn = isSignedIn(ctx)
    const admin = isAdmin(ctx)

    pageProps = {
      ...pageProps,
      currentUser,
      signedIn,
      admin
    }

    if (typeof window === "undefined") {
      if (ctx?.res?.headersSent || ctx?.res?.finished) {
        return pageProps
      }
      const props = { ...pageProps, apolloState, apollo };
      const appTreeProps =
        inAppContext ? props : { pageProps: props };

      const { getDataFromTree } = await import("@apollo/client/react/ssr")

      // Run the graphql queries on server and pass the results to frontend by using the Apollo cache.
      console.log("appTreeProps", appTreeProps)
      try {
        // getDataFromTree is using getMarkupFromTree anyway?
        await getDataFromTree(
          <AppTree
            {...appTreeProps}
          />
        )
        // Run all GraphQL queries
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error)
      }

      // Extract query data from the Apollo store
      apolloState.data = apollo.cache.extract()
    }

    (apollo as any).toJSON = () => null

    return {
      ...pageProps,
      accessToken,
      apolloState,
      apollo
    }
  }

  return withApollo
}

export default withApolloClient
