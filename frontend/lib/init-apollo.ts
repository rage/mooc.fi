import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-boost"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"
import { getAccessToken } from "./authentication"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { NextPageContext as NextContext } from "next"
import fetch from "isomorphic-unfetch"

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const production = process.env.NODE_ENV === "production"

function create(initialState: any, ctx: NextContext | undefined) {
  const httpLink = createHttpLink({
    uri: production ? "https://points.mooc.fi/api/" : "http://localhost:4000",
    credentials: "same-origin",
    fetch: fetch,
  })

  const authLink = setContext((_, { headers }) => {
    const token = getAccessToken(ctx)
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })
  const isBrowser = typeof window !== "undefined"

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          )
        if (networkError) console.log(`[Network error]: ${networkError}`)
      }),
      authLink.concat(httpLink),
    ]),
    cache: new InMemoryCache().restore(initialState || {}),
    ssrMode: !isBrowser,
  })
}

export default function initApollo(
  initialState: any,
  ctx: NextContext | undefined,
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, ctx)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx)
  }

  return apolloClient
}
