import { ComponentType, useMemo } from "react"

import { useRouter } from "next/router"

import { ApolloProvider } from "@apollo/client"

import getApollo from "./get-apollo"
import { getAccessToken } from "/lib/authentication"

const withApolloClient = <P extends object = object>(App: ComponentType<P>) => {
  const WithApollo = (pageProps: P) => {
    const router = useRouter()
    const locale = router.locale
    const accessToken = getAccessToken(undefined)

    const apolloClient = useMemo(
      () => getApollo(undefined, accessToken, locale, false),
      [accessToken, locale],
    )

    return (
      <ApolloProvider client={apolloClient}>
        <App {...pageProps} />
      </ApolloProvider>
    )
  }

  WithApollo.displayName = `withApollo(${App.displayName ?? "App"})`

  return WithApollo
}

export default withApolloClient
