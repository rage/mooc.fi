import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-boost"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"
import { createUploadLink } from "apollo-upload-client"
import { setContext } from "apollo-link-context"
import fetch from "isomorphic-unfetch"

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const production = process.env.NODE_ENV === "production"
const cypress = process.env.CYPRESS === "true"

// @ts-ignore
/* const cypress =
  process.env.CYPRESS === "true" ||
  (typeof window !== "undefined" &&
    window.Cypress &&
    window.Cypress.env("CYPRESS") === "true") */

function create(initialState: any, accessToken?: string) {
  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  }))

  // replaces standard HttpLink
  const uploadLink = createUploadLink({
    uri: cypress
      ? "http://localhost:4001"
      : production
      ? "https://www.mooc.fi/api/"
      : "http://localhost:4000",
    credentials: "same-origin",
    fetch: fetch,
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  return new ApolloClient({
    link: process.browser
      ? ApolloLink.from([errorLink, authLink.concat(uploadLink)])
      : authLink.concat(uploadLink),
    cache: new InMemoryCache().restore(initialState || {}),
    ssrMode: !process.browser, // isBrowser,
    ssrForceFetchDelay: 100,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first", //"no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "cache-first", //"no-cache",
        errorPolicy: "all",
      },
    },
  })
}

export default function initApollo(initialState: any, accessToken?: string) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, accessToken)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, accessToken)
  }

  return apolloClient
}
