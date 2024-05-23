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
    const apolloClient = getApollo(apolloState, accessToken, locale)

    return (
      <ApolloProvider client={apolloClient}>
        <App {...pageProps} />
      </ApolloProvider>
    )
  }

  withApollo.displayName = `withApollo(${App.displayName ?? "App"})`

  return withApollo
}

export default withApolloClient
