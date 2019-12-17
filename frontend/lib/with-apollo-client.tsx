import React from "react"
import initApollo from "./init-apollo"
import Head from "next/head"
import { getMarkupFromTree } from "@apollo/react-ssr"
import { renderToString } from "react-dom/server"
import { NextPageContext as NextContext } from "next"
import { ApolloClient, NormalizedCacheObject, gql } from "apollo-boost"
import { AppContext } from "next/app"
import { getAccessToken } from "/lib/authentication"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
    }
  }
`

interface Props {
  ctx: NextContext
  apolloState: any
  accessToken?: string
  apollo: ApolloClient<NormalizedCacheObject>
}

let currentUserCache: Record<string, UserOverView_currentUser> = {}

const withApolloClient = (App: any) => {
  return class Apollo extends React.Component {
    static displayName = "withApollo(App)"

    apolloClient: ApolloClient<NormalizedCacheObject>

    static async getInitialProps(appComponentContext: AppContext) {
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
      const accessToken = getAccessToken(appComponentContext.ctx)

      const apollo = initApollo(undefined, accessToken)

      // prevent repeating useroverview queries
      if (accessToken && !currentUserCache[accessToken]) {
        const { data } = await apollo.query({ query: UserDetailQuery })
        currentUserCache[accessToken] = data.currentUser
      }

      if (res?.finished) {
        return {}
      }

      // should reset to undefined when logged out
      appProps.currentUser = currentUserCache[accessToken ?? ""]

      if (!process.browser) {
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
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract()

      return {
        ...appProps,
        apolloState,
        accessToken,
      }
    }

    constructor(props: Props) {
      super(props)
      this.apolloClient = initApollo(props.apolloState, props.accessToken)
    }

    render() {
      return <App {...this.props} apollo={this.apolloClient} />
    }
  }
}

export default withApolloClient
