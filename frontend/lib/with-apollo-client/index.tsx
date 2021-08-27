import getApollo, { initNewApollo } from "./get-apollo"
import Head from "next/head"
import { getMarkupFromTree } from "@apollo/client/react/ssr"
import { getAccessToken } from "/lib/authentication"
import fetchUserDetails from "./fetch-user-details"
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
} from "@apollo/client"
// import { NextPageContext } from "next"
import { renderToString } from "react-dom/server"
import { validateToken } from "/packages/moocfi-auth"
import { DOMAIN } from "/config"
import { AppContext } from "next/app"
interface Props {
  // Server side rendered state. Prevents queries from running again in the frontend.
  apollo: ApolloClient<NormalizedCacheObject>
  apolloState: any
  accessToken?: string
}

const withApolloClient = (App: any) => {
  const withApollo = ({
    apollo,
    apolloState,
    accessToken,
    ...pageProps
  }: Props) => {
    const apolloClient = apollo ?? getApollo(apolloState, accessToken)
    return (
      <ApolloProvider client={apolloClient}>
        <App {...pageProps} />
      </ApolloProvider>
    )
  }

  withApollo.displayName = "withApollo(App)"
  withApollo.getInitialProps = async (ctx: AppContext) => {
    const { Component, AppTree } = ctx

    // @ts-ignore: ctx?.res
    const res = ctx?.res ?? ctx?.ctx?.res

    let props: any = {
      pageProps: {},
    }
    if (App.getInitialProps) {
      props = await App.getInitialProps(ctx)
    }

    // @ts-ignore: ctx in ctx
    const inAppContext = Boolean(ctx?.ctx)

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    // @ts-ignore: ctx in ctx
    const accessToken = await getAccessToken(ctx?.ctx ?? ctx)
    // It is important to use a new apollo since the page has changed because
    // 1. access token might have changed
    // 2. We've decided to discard apollo cache between page transitions to avoid bugs.
    //  @ts-ignore: ignore type error on ctx
    const apollo = initNewApollo(accessToken)
    // @ts-ignore: ignore
    apollo.toJSON = () => null
    // UserDetailsContext uses this
    const currentUser = await fetchUserDetails(apollo)

    props.pageProps.currentUser = currentUser
    // @ts-ignore: ctx in ctx
    props.pageProps.validated = Boolean(
      await validateToken("tmc", DOMAIN, ctx?.ctx ?? ctx),
    )

    if (!process.browser) {
      if (inAppContext) {
        props = { ...props, apollo }
      } else {
        props = { pageProps: { ...props, apollo } }
      }
      if (res?.finished) {
        return props
      }

      // Run the graphql queries on server and pass the results to frontend by using the Apollo cache.

      try {
        // getDataFromTree is using getMarkupFromTree anyway?
        await getMarkupFromTree({
          renderFunction: renderToString,
          tree: (
            <AppTree
              {...props}
              pageProps={props?.pageProps ?? {}}
              Component={Component}
              /*pageProps={{
                ...appProps.pageProps,
              }}
              apollo={apollo}*/
            />
          ),
        })
        // Run all GraphQL queries
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error("Error while running `getDataFromTree`", error)
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind()
    }

    // Extract query data from the Apollo store
    const apolloState = apollo.cache.extract()

    return {
      ...props,
      accessToken,
      // apollo,
      apolloState,
    }
  }

  return withApollo
}

export default withApolloClient
