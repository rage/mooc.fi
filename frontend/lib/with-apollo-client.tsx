import React from "react"
import initApollo from "./init-apollo"
import Head from "next/head"
import { getDataFromTree, getMarkupFromTree } from "@apollo/react-ssr"
import { renderToString } from "react-dom/server"
import { NextPageContext as NextContext } from "next"
import { ApolloClient, NormalizedCacheObject } from "apollo-boost"
import { AppContext } from "next/app"

interface Props {
  ctx: NextContext
  apolloState: any
}

const withApolloClient = (App: any) => {
  return class Apollo extends React.Component {
    static displayName = "withApollo(App)"

    apolloClient: ApolloClient<NormalizedCacheObject>
    static async getInitialProps(appComponentContext: AppContext) {
      const { Component, router } = appComponentContext

      let appProps = {}
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appComponentContext)
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo(undefined, appComponentContext.ctx)
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apollo={apollo}
            />,
          )
          await getMarkupFromTree({
            renderFunction: renderToString,
            tree: (
              <App
                {...appProps}
                Component={Component}
                router={router}
                apollo={apollo}
              />
            ),
          })
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
      }
    }

    constructor(props: Props) {
      super(props)
      this.apolloClient = initApollo(props.apolloState, undefined)
    }

    render() {
      return <App {...this.props} apollo={this.apolloClient} />
    }
  }
}

export default withApolloClient
