import getApollo, { initNewApollo } from "./get-apollo"
import Head from "next/head"
import { getMarkupFromTree } from "@apollo/client/react/ssr"
import { renderToString } from "react-dom/server"
import { AppContext } from "next/app"
import { getAccessToken } from "/lib/authentication"
import fetchUserDetails from "./fetch-user-details"

interface Props {
  // Server side rendered state. Prevents queries from running again in the frontend.
  apolloState: any
  accessToken?: string
}

const withApolloClient = (App: any) => {
  const withApollo = (props: Props) => {
    const apolloClient = getApollo(props.apolloState, props.accessToken)
    return <App {...props} apollo={apolloClient} />
  }

  withApollo.displayName = "withApollo(App)"
  withApollo.getInitialProps = async (appComponentContext: AppContext) => {
    const {
      Component,
      router,
      AppTree,
      ctx: { res },
    } = appComponentContext

    let appProps: any = {}
    if (App.getInitialProps) {
      appProps = await App.getInitialProps(appComponentContext)
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    const accessToken = await getAccessToken(appComponentContext.ctx)

    // It is important to use a new apollo since the page has changed because
    // 1. access token might have changed
    // 2. We've decided to discard apollo cache between page transitions to avoid bugs.
    const apollo = initNewApollo(accessToken)

    // UserDetailsContext uses this
    appProps.currentUser = await fetchUserDetails(apollo)

    if (res?.finished) {
      return {}
    }

    if (process.browser) {
      return {
        ...appProps,
        undefined,
        accessToken,
      }
    }

    // Run the graphql queries on server and pass the results to frontend by using the Apollo cache.

    try {
      // getDataFromTree is using getMarkupFromTree anyway?
      await getMarkupFromTree({
        renderFunction: renderToString,
        tree: (
          <AppTree
            pageProps={{}}
            {...appProps}
            Component={Component}
            router={router}
            apollo={apollo}
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

    // Extract query data from the Apollo store
    const apolloState = apollo.cache.extract()

    return {
      ...appProps,
      apolloState,
      accessToken,
    }
  }

  return withApollo
}

export default withApolloClient
